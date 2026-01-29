---
name: caching-strategy
description: Understand the caching architecture, Cache Components (PPR), and revalidation mechanisms. Use when debugging stale content, modifying caching behavior, or understanding data freshness guarantees.
---

# Caching Strategy

> **Reference**: [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) — the official documentation for `use cache`, `cacheLife`, `cacheTag`, and Partial Prerendering.

## When to Use

Use this skill when:

- Understanding which data is cached vs. real-time
- Debugging why content isn't updating after Dashboard changes
- Configuring Saleor webhooks for cache invalidation
- Modifying the `/api/revalidate` endpoint
- Working with `"use cache"` and Suspense patterns

---

## Data Freshness Model

### The Key Principle

> **Display pages are cached for performance. Transactional flows are always real-time.**

| Page/Component                | Data Source                                 | Freshness              | Why                         |
| ----------------------------- | ------------------------------------------- | ---------------------- | --------------------------- |
| **PDP (Product Detail)**      | `getProductData()`                          | ⚠️ Cached (5 min TTL)  | Performance - instant loads |
| **Category/Collection pages** | `getCategoryData()` / `getCollectionData()` | ⚠️ Cached (5 min TTL)  | Performance                 |
| **Homepage**                  | `getFeaturedProducts()`                     | ⚠️ Cached (5 min TTL)  | Performance                 |
| **Navigation**                | `NavLinks`                                  | ⚠️ Cached (1 hour TTL) | Rarely changes              |
| **Cart Drawer**               | `Checkout.find()`                           | ✅ Always fresh        | Uses `cache: "no-cache"`    |
| **Checkout Page**             | `useCheckoutQuery()`                        | ✅ Always fresh        | Direct API call via urql    |
| **Add to Cart action**        | Saleor mutation                             | ✅ Always fresh        | Saleor calculates price     |

### Price Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRICE FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   PDP Display          Cart/Checkout          Payment               │
│   ────────────         ─────────────          ───────               │
│                                                                     │
│   ┌───────────┐        ┌───────────┐         ┌───────────┐         │
│   │  Cached   │───────▶│  FRESH    │────────▶│  FRESH    │         │
│   │  $29.99   │  Add   │  $35.99   │  Pay    │  $35.99   │         │
│   └───────────┘  to    └───────────┘         └───────────┘         │
│                  Cart                                               │
│   "use cache"          cache:"no-cache"      Saleor validates       │
│   5 min TTL            Always from API       at checkout            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

⚠️ User may see different price in cart than on PDP if price changed.
✅ User CANNOT checkout at stale price - Saleor always uses current price.
```

### Why This Is Safe

1. **Saleor is the source of truth**: When you call `checkoutLinesAdd`, Saleor calculates the price server-side using current data
2. **Cart always fetches fresh**: `Checkout.find()` uses `cache: "no-cache"`
3. **Checkout validates**: `checkoutComplete` will fail if something is wrong
4. **Webhooks enable instant updates**: When configured, price changes trigger immediate cache invalidation

---

## Cache Components Architecture

### What It Is

Cache Components enable **Partial Prerendering (PPR)** - mixing static, cached, and dynamic content in a single route. The static shell is served instantly from CDN, while dynamic parts stream in via Suspense.

### Current Status: ✅ ENABLED (Experimental)

> ⚠️ **Note**: Cache Components are still marked **experimental** in Next.js. The patterns are functional but evolving. See [Disabling Cache Components](#disabling-cache-components) if you need to rollback.

Cache Components are enabled in `next.config.js`:

```javascript
const config = {
	cacheComponents: true,
};
```

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  STATIC SHELL (Instant from CDN)                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Header skeleton, layout, cached product data            │   │
│  │  Source: "use cache" functions (getProductData, etc.)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  <Suspense fallback={<Skeleton />}>                     │   │
│  │    Dynamic content (streams in after initial render)     │   │
│  │    - Variant selection (reads searchParams)              │   │
│  │    - Logo, NavLinks (use usePathname)                    │   │
│  │    - Cart count (reads cookies)                          │   │
│  │  </Suspense>                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Cached Functions with Tags

Each cached function has a **tag** for targeted invalidation:

```typescript
// src/app/[channel]/(main)/products/[slug]/page.tsx
async function getProductData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 min default TTL
	cacheTag(`product:${slug}`); // Tag for webhook invalidation

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel },
	});
}
```

### Tag Registry

| Tag Pattern         | Used By                                        | Invalidated When          |
| ------------------- | ---------------------------------------------- | ------------------------- |
| `product:{slug}`    | `getProductData()`                             | Product updated in Saleor |
| `category:{slug}`   | `getCategoryData()`                            | Category updated          |
| `collection:{slug}` | `getCollectionData()`, `getFeaturedProducts()` | Collection updated        |
| `navigation`        | `NavLinks`                                     | Menu structure changed    |

---

## Key Patterns

### 1. Suspense Around Dynamic Content

Any component accessing runtime data must be wrapped in Suspense.

**What counts as "dynamic data" (triggers Suspense requirement):**

| Data Access                 | Why It's Dynamic    |
| --------------------------- | ------------------- |
| `cookies()`                 | Per-request         |
| `headers()`                 | Per-request         |
| `searchParams`              | URL-dependent       |
| `usePathname()`             | Client-side routing |
| `useParams()`               | Client-side routing |
| `Date.now()`                | Time-dependent      |
| Server Actions              | Form submissions    |
| `cache: "no-cache"` fetches | Always fresh        |

```tsx
// Layout wraps children in Suspense
<main className="flex-1">
  <Suspense>{props.children}</Suspense>
</main>

// Header wraps NavLinks in Suspense (uses usePathname for active state)
<Suspense fallback={<NavLinksSkeleton />}>
  <NavLinks channel={channel} />
</Suspense>
```

### 2. Public vs Authenticated Queries

Two explicit GraphQL helpers:

- `executePublicGraphQL` - Safe inside `"use cache"` (no cookies needed)
- `executeAuthenticatedGraphQL` - NOT safe inside `"use cache"` (requires cookies)

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// ✅ Public data - safe inside "use cache"
async function getProductData(slug: string, channel: string) {
	"use cache";
	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel },
	});
}

// ✅ User data - NOT inside "use cache" (requires cookies)
const { me } = await executeAuthenticatedGraphQL(CurrentUserDocument, {
	cache: "no-cache",
});
```

### 3. Don't Use `searchParams` Inside `"use cache"`

```typescript
// ❌ BAD - searchParams is runtime data
export async function generateMetadata(props) {
	"use cache";
	const searchParams = await props.searchParams; // Error!
}

// ✅ GOOD - Only access params (becomes cache key)
export async function generateMetadata(props) {
	"use cache";
	const params = await props.params; // OK
}

// ✅ GOOD - Access searchParams outside cache scope
export async function generateMetadata(props) {
	const searchParams = await props.searchParams; // No "use cache"
}
```

### 4. CSS Order Pattern for Mixed Static/Dynamic Layouts

When you need dynamic content to appear **above** static content visually, use CSS `order`:

```tsx
// PDP: Category (dynamic) appears above Product Name (static)
<div className="flex flex-col gap-3">
	{/* Static shell - renders first but order:2 */}
	<h1 className="order-2">{product.name}</h1>

	{/* Dynamic - streams in, order:1 appears above h1 */}
	<Suspense fallback={<Skeleton className="order-1" />}>
		<VariantSection /> {/* Contains order-1 and order-3 elements */}
	</Suspense>

	{/* Static - order:4 appears last */}
	<div className="order-4">
		<ProductAttributes />
	</div>
</div>
```

**Visual result:**

```
1. Category + Sale badge  (dynamic, order-1)
2. Product Name           (static, order-2)
3. Variant selectors      (dynamic, order-3)
4. Product details        (static, order-4)
```

This keeps `<h1>` in the static shell for SEO while allowing dynamic content to appear above it.

### 5. GraphQL Auth Defaults

Two explicit GraphQL helpers ensure you always know what data access level you're using:

- `executePublicGraphQL` - Public queries only (products, menus, categories)
- `executeAuthenticatedGraphQL` - Requires user session cookies (checkout, user data)

This ensures:

- Only publicly visible products are fetched
- No user cookies in cache scope (safe for `"use cache"`)
- No "Signature has expired" errors on public pages

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// ✅ Public data (menus, products) - no auth, only public data
const menu = await executePublicGraphQL(MenuDocument, {
	variables: { slug: "footer" },
});

// ✅ User data - requires session cookies
let user = null;
try {
	const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});
	user = result.me;
} catch {
	// Expired token = treat as not logged in
}

// ✅ Checkout/cart - requires session cookies
await executeAuthenticatedGraphQL(CheckoutAddLineDocument, {
	variables: { id: checkoutId, productVariantId: variantId },
	cache: "no-cache",
});

// ✅ App token (server-side only) - explicit header
const channels = await executePublicGraphQL(ChannelsListDocument, {
	headers: {
		Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
	},
});
```

---

## Cache Invalidation

### Automatic via Webhooks (Recommended)

When configured, Saleor sends webhooks on data changes, triggering instant invalidation.

**Setup in Saleor Dashboard:**

1. Go to **Configuration → Webhooks**
2. Create webhook pointing to: `https://your-site.com/api/revalidate`
3. Subscribe to events:
   - `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_DELETED`
   - `CATEGORY_CREATED`, `CATEGORY_UPDATED`, `CATEGORY_DELETED`
   - `COLLECTION_CREATED`, `COLLECTION_UPDATED`, `COLLECTION_DELETED`
4. Copy the **secret key** to `SALEOR_WEBHOOK_SECRET` env var

**What happens on webhook:**

```typescript
// Product update webhook triggers:
revalidateTag(`product:${slug}`, "minutes"); // Invalidates "use cache" data
revalidatePath(`/channel/products/${slug}`); // Invalidates ISR page
```

### Manual Invalidation

```bash
# Invalidate a specific product (both tag and path)
curl "https://store.com/api/revalidate?secret=xxx&tag=product:blue-hoodie&path=/default-channel/products/blue-hoodie"

# Invalidate just the cached function data
curl "https://store.com/api/revalidate?secret=xxx&tag=product:blue-hoodie"

# Invalidate navigation (uses "hours" profile)
curl "https://store.com/api/revalidate?secret=xxx&tag=navigation&profile=hours"
```

### No Webhooks? TTL Takes Over

| Data        | Default TTL |
| ----------- | ----------- |
| Products    | 5 minutes   |
| Categories  | 5 minutes   |
| Collections | 5 minutes   |
| Navigation  | 1 hour      |

---

## Environment Variables

```env
# Cache invalidation
REVALIDATE_SECRET=your-secret       # Manual revalidation (GET requests)
SALEOR_WEBHOOK_SECRET=webhook-hmac  # Saleor webhook HMAC verification
```

---

## Debugging Stale Content

### Checklist

1. **Is the webhook configured?**

   - Check Saleor Dashboard → Webhooks → Deliveries

2. **Did the webhook fire?**

   - Check server logs for `[Revalidate]` entries

3. **Is the tag correct?**

   - Product slugs must match exactly: `product:blue-hoodie`

4. **Force manual revalidation:**

   ```bash
   curl "https://store.com/api/revalidate?secret=xxx&tag=product:my-product"
   ```

5. **Check browser cache:**
   - Hard refresh: Cmd+Shift+R / Ctrl+Shift+R

---

## Anti-patterns

❌ **Don't use `cache: "no-cache"` for display pages** - Destroys performance  
❌ **Don't skip webhook setup in production** - Users see stale prices  
❌ **Don't access cookies/searchParams inside `"use cache"`** - Will error  
❌ **Don't use `executeAuthenticatedGraphQL` inside `"use cache"`** - Requires cookies  
❌ **Don't expose `REVALIDATE_SECRET`** - Keep it server-side only

---

## Disabling Cache Components

If you need to rollback to standard ISR caching:

### Step 1: Disable in Config

```javascript
// next.config.js
const config = {
	cacheComponents: false, // or comment out entirely
};
```

### Step 2: Remove Cache Directives

Remove `"use cache"`, `cacheLife()`, and `cacheTag()` from these files:

| File                                                   | What to Remove                           |
| ------------------------------------------------------ | ---------------------------------------- |
| `src/app/[channel]/(main)/products/[slug]/page.tsx`    | `getProductData()` cache directives      |
| `src/app/[channel]/(main)/categories/[slug]/page.tsx`  | `getCategoryData()` cache directives     |
| `src/app/[channel]/(main)/collections/[slug]/page.tsx` | `getCollectionData()` cache directives   |
| `src/app/[channel]/(main)/page.tsx`                    | `getFeaturedProducts()` cache directives |
| `src/ui/components/nav/components/nav-links.tsx`       | Navigation cache directives              |

### Step 3: Update Revalidation

```typescript
// src/app/api/revalidate/route.ts
// Change from:
revalidateTag(`product:${slug}`, "minutes");
// To:
revalidateTag(`product:${slug}`); // Remove second argument
```

### What You Can Keep

- **Suspense boundaries** - Still useful for loading states
- **CSS order layout** - Pure CSS, no impact
- **`executeAuthenticatedGraphQL`** - Good separation regardless
- **ISR via `revalidate` option** - Works as fallback

---

## Files Reference

| File                                                   | Purpose                                  |
| ------------------------------------------------------ | ---------------------------------------- |
| `src/app/api/revalidate/route.ts`                      | Webhook endpoint and manual revalidation |
| `src/app/[channel]/(main)/products/[slug]/page.tsx`    | PDP with "use cache"                     |
| `src/app/[channel]/(main)/categories/[slug]/page.tsx`  | Category with "use cache"                |
| `src/app/[channel]/(main)/collections/[slug]/page.tsx` | Collection with "use cache"              |
| `src/app/[channel]/(main)/page.tsx`                    | Homepage with "use cache"                |
| `src/ui/components/pdp/variant-section-dynamic.tsx`    | Dynamic variant section                  |
| `src/ui/components/header.tsx`                         | Header with Suspense boundaries          |
| `src/lib/checkout.ts`                                  | Cart operations (always fresh)           |
| `next.config.js`                                       | `cacheComponents: true`                  |
