# Saleor Paper Storefront

**Version 1.5.0**  
Saleor Paper  
February 2026

> **Note:** This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring this Saleor storefront codebase. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.
>
> **Source of truth:** Individual rule files in `rules/` are updated first. Regenerate this file with:
> `node skills/saleor-paper-storefront/scripts/compile-agents.mjs`

---

## Abstract

Comprehensive guide for AI agents and LLMs maintaining the Saleor Paper storefront — a Next.js 16 e-commerce application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Covers 14 rules across 6 categories: data layer (caching, auth, GraphQL), product pages (PDP, variants, filtering), checkout flow (surfaces, management, payments, components), UI, SEO, and development practices. Each rule includes architecture diagrams, code examples, file locations, and anti-patterns.

---

## Table of Contents

1. [Data Layer](#1-data-layer) — **CRITICAL**

   - 1.1 [Caching Strategy](#11-caching-strategy)
   - 1.2 [GraphQL Workflow](#12-graphql-workflow)
   - 1.3 [Auth Routes (BFF)](#13-auth-routes-bff)

2. [Product Pages](#2-product-pages) — **HIGH**

   - 2.1 [Product Detail Page](#21-product-detail-page)
   - 2.2 [Variant Selection](#22-variant-selection)
   - 2.3 [Product Filtering](#23-product-filtering)

3. [Checkout Flow](#3-checkout-flow) — **HIGH**

   - 3.1 [Paper Surfaces](#31-paper-surfaces)
   - 3.2 [Checkout Management](#32-checkout-management)
   - 3.3 [Payment Gateways](#33-payment-gateways)
   - 3.4 [Checkout Components](#34-checkout-components)

4. [UI & Channels](#4-ui-channels) — **MEDIUM**

   - 4.1 [UI Components](#41-ui-components)
   - 4.2 [Channels & Multi-Currency](#42-channels-multi-currency)

5. [SEO](#5-seo) — **MEDIUM**

   - 5.1 [SEO & Metadata](#51-seo-metadata)

6. [Development](#6-development) — **MEDIUM**
   - 6.1 [Saleor API Investigation](#61-saleor-api-investigation)

---

## 1. Data Layer

**Impact: CRITICAL**

The data layer controls caching, GraphQL type generation, and API communication. Getting this wrong causes stale content, type errors, or permission failures.

### 1.1 Caching Strategy

Understanding the caching architecture, Cache Components (PPR), and revalidation mechanisms ensures correct data freshness, avoids stale content, and enables targeted cache invalidation when Saleor data changes.

> **Reference**: [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) — the official documentation for `use cache`, `cacheLife`, `cacheTag`, and Partial Prerendering.

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
| **Checkout Page**             | `syncCheckoutFromServer()` + server actions | ✅ Always fresh        | Server actions + RSC        |
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

### Reference Architecture

Target layout for catalog routes with Cache Components enabled:

```
ProductPage (sync export)
└── Suspense (page skeleton or route loading.tsx)
    └── ProductShell (await params + cached data ONLY — never searchParams)
        ├── breadcrumbs, h1, attributes, JSON-LD, LCP preload
        ├── Suspense → VariantGalleryDynamic (searchParams)
        └── Suspense → VariantSectionDynamic (searchParams)

Layout shell
├── Suspense → Header (cached menu data + dynamic cart/user)
├── <main>{children}</main>          ← no Suspense wrapper on main
├── Suspense → Footer (cached menus + channels)
└── Suspense → CartDrawer (cookies, no-cache)

Invalidation: Saleor webhook → revalidateTag(tag, profile) + revalidatePath per channel
```

**Key files**

| Purpose             | Location                                |
| ------------------- | --------------------------------------- |
| Cache manifest      | `src/lib/cache-manifest.ts`             |
| Catalog fetches     | `src/lib/catalog/*.ts`                  |
| Menu fetches        | `src/lib/menus/get-menu-data.ts`        |
| Channel fetches     | `src/lib/channels/get-channels-data.ts` |
| Revalidation API    | `src/app/api/revalidate/route.ts`       |
| Cache introspection | `src/app/api/cache-info/route.ts`       |

### Cache Manifest — Single Source of Truth

All cache profiles are defined in `src/lib/cache-manifest.ts`. This module is imported by:

- **Cached functions** — for `cacheLife()` / `cacheTag()` calls
- **`/api/cache-info`** — to serve the manifest to the saleor-paper-app (Dashboard)

```typescript
import { PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

async function getProductData(slug: string, channel: string) {
	"use cache";
	applyCacheProfile(PROFILES.products, slug);

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel },
	});
}
```

To change a TTL or tag pattern, edit `src/lib/cache-manifest.ts`. Both the actual caching behavior and the dashboard app's view of the cache update automatically.

### Tag Registry

| Tag Pattern             | Profile ID    | Used By                                        | Invalidated When          |
| ----------------------- | ------------- | ---------------------------------------------- | ------------------------- |
| `product:{slug}`        | `products`    | PDP `getProductData()`                         | Product updated in Saleor |
| `category:{slug}`       | `categories`  | `getCategoryData()`                            | Category updated          |
| `collection:{slug}`     | `collections` | `getCollectionData()`, `getFeaturedProducts()` | Collection updated        |
| `page:{slug}`           | `pages`       | `getPageData()` (CMS)                          | Page updated              |
| `navigation:{channel}`  | `navigation`  | `getNavbarMenuItems()`                         | Navbar menu changed       |
| `footer-menu:{channel}` | `footerMenu`  | `getFooterMenuItems()`                         | Footer menu changed       |
| `channels`              | `channels`    | `getCachedChannelsList()`                      | Channel list changed      |

**Named `cacheLife` tiers** (via `applyCacheProfile`, configured in `next.config.js`):

| Profile ID                  | Tier name  | Typical TTL | Used for                          |
| --------------------------- | ---------- | ----------- | --------------------------------- |
| `products`                  | `catalog`  | ~5 min      | Products, categories, collections |
| `pages`                     | `catalog`  | ~5 min      | CMS pages                         |
| `navigation` / `footerMenu` | `menus`    | ~1 hour     | Nav + footer menus                |
| `channels`                  | `channels` | longer      | Channel metadata list             |

Do **not** add fetch-level `revalidate` on GraphQL calls inside `"use cache"` functions — `cacheLife` + webhooks handle freshness.

### Cache Introspection Endpoint

`GET /api/cache-info` returns a machine-readable manifest of all profiles. Protected by `REVALIDATE_SECRET` via `Authorization: Bearer` header (timing-safe comparison). Used by the saleor-paper-app to discover what the storefront caches and build its invalidation UI dynamically.

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" "https://store.com/api/cache-info"
# Returns: { version: 1, profiles: [{ id, label, ttlSeconds, cacheProfile, tagPattern, pathPattern }, ...] }
```

---

## Key Patterns

### 1. Three-Layer Page Model (CRITICAL)

Every catalog route should follow this boundary stack:

1. **Sync page export** — passes `params` / `searchParams` promises through, no awaits at top level.
2. **Page-level Suspense** — isolates cached data fetch from the layout; use route `loading.tsx` for outer skeletons.
3. **Shell** — awaits `params` + `"use cache"` data only. Static UI (h1, breadcrumbs, JSON-LD) lives here.
4. **Dynamic islands** — nested Suspense per runtime concern (`searchParams`, cookies, client routing hooks).

```tsx
// ✅ CORRECT
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<PageShell params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function PageShell({ params, searchParams }) {
	const { slug, channel } = await params;
	const product = await getProductData(slug, channel); // "use cache"
	return (
		<>
			<h1>{product.name}</h1>
			<Suspense fallback={<GallerySkeleton />}>
				<VariantGalleryDynamic product={product} searchParams={searchParams} />
			</Suspense>
		</>
	);
}
```

```tsx
// ❌ BAD — awaiting searchParams in shell collapses the whole page into a dynamic hole
async function ProductShell({ searchParams, ... }) {
	const { variant } = await searchParams; // Dynamic!
	const product = await getProductData(...);
}
```

### 2. Data Layer Conventions

Place `"use cache"` GraphQL fetches in dedicated modules — not inline in page files long-term:

| Layer    | Location                         | Examples                                                      |
| -------- | -------------------------------- | ------------------------------------------------------------- |
| Catalog  | `src/lib/catalog/`               | `get-featured-products`, `get-category-data`, `get-page-data` |
| Menus    | `src/lib/menus/get-menu-data.ts` | `getNavbarMenuItems`, `getFooterMenuItems`                    |
| Channels | `src/lib/channels/`              | `getCachedChannelsList`                                       |

Always use `applyCacheProfile(CACHE_PROFILES.*, slugOrChannel)` — never raw `cacheLife("minutes")` or manual `cacheTag` strings that drift from the manifest.

**Do not** re-export server cached helpers from barrels that also export client components (e.g. import `ProductGalleryLcp` directly, not via a mixed `pdp/index.ts` barrel).

### 3. Page Patterns by Route Type

| Route                                  | Shell (cached)                                          | Dynamic islands                                                               |
| -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Homepage**                           | Sync `<section>` wrapper                                | `FeaturedProducts` in Suspense → `getFeaturedProducts()`                      |
| **PLP** (category/collection/products) | Hero/title from `getCategoryData` / `getCollectionData` | Product grid in nested Suspense (filters/sort via `searchParams`)             |
| **PDP**                                | `ProductShell`: name, attributes, JSON-LD, preload      | `VariantGalleryDynamic` + `VariantSectionDynamic` (separate Suspense)         |
| **CMS page**                           | Sync page export                                        | `PageContent` in Suspense → `getPageData()`                                   |
| **Account** (`/account/*`)             | Layout `AccountShell` + `AccountProvider`               | Per-page Suspense for orders; profile via context (see `data-auth-routes.md`) |

See `product-pdp.md` for PDP specifics. PLP routes use `loading.tsx` at the route segment.  
See `data-auth-routes.md` for migrating other logged-in route trees.

### 4. Suspense Around Dynamic Content

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
// Layout: Header/Footer/Cart each in their own Suspense — NOT a wrapper on <main>
<main className="flex-1">{props.children}</main>

// Route-level loading UI (preferred for page transitions)
// src/app/[channel]/(main)/categories/[slug]/loading.tsx

// Header wraps NavLinks in Suspense (uses usePathname for active state)
<Suspense fallback={<NavLinksSkeleton />}>
  <NavLinks channel={channel} />
</Suspense>
```

**Do not** use `Suspense fallback={null}` on `<main>` — it prevents route `loading.tsx` from participating and hides useful skeletons.

### 5. Sync Page Shell Pattern (CRITICAL)

Page components that use `"use cache"` data must be **synchronous** and wrap async content in a **dedicated Suspense boundary**. This prevents cached async work from flowing through the layout boundary, which can cause hydration/reconciliation issues.

(See [Three-Layer Page Model](#1-three-layer-page-model-critical) above — this is the same rule, repeated here because it is the most common PPR mistake.)

```tsx
// ✅ CORRECT - Page is sync, async content has its own Suspense
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<PageContent params={props.params} />
		</Suspense>
	);
}

async function PageContent({ params: paramsPromise }) {
	const params = await paramsPromise;
	const data = await getCachedData(params.slug, params.channel);
	return <ProductList products={data} channel={params.channel} />;
}
```

All page routes in this project follow this pattern:

- `src/app/[channel]/(main)/page.tsx` (homepage)
- `src/app/[channel]/(main)/pages/[slug]/page.tsx` (CMS pages)
- `src/app/[channel]/(main)/categories/[slug]/page.tsx`
- `src/app/[channel]/(main)/collections/[slug]/page.tsx`
- `src/app/[channel]/(main)/products/[slug]/page.tsx`

### 6. Public vs Authenticated Queries

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

### 7. Don't Use `searchParams` Inside `"use cache"`

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

### 8. CSS Order Pattern for Mixed Static/Dynamic Layouts

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
   - `PAGE_CREATED`, `PAGE_UPDATED`, `PAGE_DELETED`
   - `MENU_CREATED`, `MENU_UPDATED`, `MENU_DELETED`
   - `MENU_ITEM_CREATED`, `MENU_ITEM_UPDATED`, `MENU_ITEM_DELETED`
4. Copy the **secret key** to `SALEOR_WEBHOOK_SECRET` env var

**What happens on webhook** (via `src/app/api/revalidate/route.ts`):

```typescript
// Product update — tag + path per storefront channel
revalidateTag(`product:${slug}`, resolveRevalidateCacheLifeProfile("products"));
for (const channel of await getStorefrontChannelSlugs()) {
	revalidatePath(`/${channel}/products/${slug}`);
}

// Menu update — channel-scoped tags (navbar vs footer mapped by menu slug)
revalidateTag(`navigation:${channel}`, resolveRevalidateCacheLifeProfile("navigation"));
revalidateTag(`footer-menu:${channel}`, resolveRevalidateCacheLifeProfile("footerMenu"));
```

Path revalidation uses `getStorefrontChannelSlugs()` so multi-channel deployments invalidate every allowed channel. See `ui-channels.md` for allowlist configuration.

### Manual Invalidation

All manual invalidation requests use the `Authorization: Bearer` header (timing-safe comparison):

```bash
# Invalidate a specific product (both tag and path)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/default-channel/products/blue-hoodie"

# Invalidate just the cached function data
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie"

# Invalidate navigation for a channel (uses "menus" profile)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=navigation:default-channel"

# Invalidate footer menu for a channel
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=footer-menu:default-channel"
```

### No Webhooks? TTL Takes Over

| Data        | Default TTL |
| ----------- | ----------- |
| Products    | 5 minutes   |
| Categories  | 5 minutes   |
| Collections | 5 minutes   |
| CMS pages   | 5 minutes   |
| Navigation  | 1 hour      |

---

## Environment Variables

```env
# Cache invalidation — use ≥32 character random strings in production
REVALIDATE_SECRET=your-secret       # Bearer token for manual revalidation & cache-info
SALEOR_WEBHOOK_SECRET=webhook-hmac  # Saleor webhook HMAC verification
```

**Security**: Both endpoints use timing-safe comparison and `Authorization: Bearer` header authentication. Query-string `?secret=` still works but logs a deprecation warning — migrate callers to the header.

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
   curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
     "https://store.com/api/revalidate?tag=product:my-product"
   ```

5. **Check browser cache:**
   - Hard refresh: Cmd+Shift+R / Ctrl+Shift+R

---

## Anti-patterns

❌ **Don't use `cache: "no-cache"` for display pages** — Destroys performance  
❌ **Don't skip webhook setup in production** — Users see stale prices  
❌ **Don't access cookies/searchParams inside `"use cache"`** — Will error  
❌ **Don't await `searchParams` in shell components** — Collapses the whole page into a dynamic hole  
❌ **Don't use `executeAuthenticatedGraphQL` inside `"use cache"`** — Requires cookies  
❌ **Don't add fetch-level `revalidate` inside `"use cache"` functions** — `cacheLife` + webhooks handle freshness  
❌ **Don't use raw `cacheLife("minutes")` or hand-rolled `cacheTag` strings** — Use `applyCacheProfile(CACHE_PROFILES.*)` from the manifest  
❌ **Don't wrap `<main>` in Suspense with `fallback={null}`** — Blocks route `loading.tsx` skeletons  
❌ **Don't make page components async when using `"use cache"` data** — Use the sync page shell pattern  
❌ **Don't pass `REVALIDATE_SECRET` in query strings** — Use the `Authorization: Bearer` header  
❌ **Don't re-export server cached helpers from client-mixed barrels** — Import catalog/menu modules directly

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

| File                                                   | Purpose                                                               |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `src/lib/api-auth.ts`                                  | Shared auth: timing-safe secret verification, Bearer token extraction |
| `src/lib/cache-manifest.ts`                            | Cache profile definitions (single source of truth)                    |
| `src/app/api/cache-info/route.ts`                      | Cache introspection endpoint for dashboard app                        |
| `src/app/api/revalidate/route.ts`                      | Webhook endpoint and manual revalidation                              |
| `src/lib/catalog/*.ts`                                 | Catalog `"use cache"` fetches (featured, category, collection, page)  |
| `src/lib/menus/get-menu-data.ts`                       | Navbar + footer menu cached fetches                                   |
| `src/lib/channels/get-channels-data.ts`                | Channel list cache                                                    |
| `src/lib/channel-slugs.ts`                             | Storefront channel allowlist resolution                               |
| `src/app/[channel]/(main)/products/[slug]/page.tsx`    | PDP with ProductShell + dynamic islands                               |
| `src/app/[channel]/(main)/categories/[slug]/page.tsx`  | Category with "use cache"                                             |
| `src/app/[channel]/(main)/collections/[slug]/page.tsx` | Collection with "use cache"                                           |
| `src/app/[channel]/(main)/page.tsx`                    | Homepage with "use cache"                                             |
| `src/ui/components/nav/components/nav-links.tsx`       | Navigation with "use cache"                                           |
| `src/ui/components/footer.tsx`                         | Footer menu + channels with "use cache"                               |
| `src/ui/components/pdp/variant-section-dynamic.tsx`    | Dynamic variant section                                               |
| `src/ui/components/header.tsx`                         | Header with Suspense boundaries                                       |
| `src/lib/checkout.ts`                                  | Cart operations (always fresh)                                        |
| `next.config.js`                                       | `cacheComponents: true`                                               |

---

### 1.2 GraphQL Workflow

Modifying GraphQL queries and regenerating types correctly ensures type safety, avoids permission errors, and keeps storefront and checkout data in sync with the Saleor schema.

> **Sources**:
>
> - [Saleor API Reference](https://docs.saleor.io/api-reference) - GraphQL schema and field permissions
> - [graphql-codegen](https://the-guild.dev/graphql/codegen) - Type generation

---

## File Locations

| Purpose                           | Location                         | Generated Types                   | Regenerate With          |
| --------------------------------- | -------------------------------- | --------------------------------- | ------------------------ |
| Storefront (products, cart, etc.) | `src/graphql/*.graphql`          | `src/gql/`                        | `pnpm generate`          |
| Checkout flow                     | `src/checkout/graphql/*.graphql` | `src/checkout/graphql/generated/` | `pnpm generate:checkout` |

> **Note**: Storefront and checkout have **separate codegen setups** (`src/gql/` vs `src/checkout/graphql/generated/`). Both surfaces fetch at runtime via server helpers (`executePublicGraphQL` / `executeAuthenticatedGraphQL`) and checkout server actions — not browser GraphQL. Auth mutations use BFF routes (`/api/auth/*`), not the GraphQL documents directly from the client.

---

## Making Changes

Edit the `.graphql` file. Example - adding a field:

```graphql
query ProductDetails($slug: String!, $channel: String!) {
	product(slug: $slug, channel: $channel) {
		id
		name
		newField # Add your field here
	}
}
```

---

## Regenerating Types (CRITICAL)

```bash
# For storefront queries (src/graphql/*.graphql)
pnpm run generate

# For checkout queries (src/checkout/graphql/*.graphql)
pnpm run generate:checkout
```

This regenerates TypeScript types. **Always run the appropriate command after any GraphQL change.**

- `src/gql/` - Storefront types (DO NOT EDIT)
- `src/checkout/graphql/generated/` - Checkout types (DO NOT EDIT)

---

## Using the Types

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

const { product } = await executePublicGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 60,
});
// TypeScript now recognizes product.newField
```

---

## Checking the Saleor Schema

To confirm field names, types, nullability, or enum values, search the generated types file:

```bash
# Full schema types, generated from your running Saleor instance
grep -A 20 "^export type Product " src/gql/graphql.ts

# Check an enum
grep -A 10 "^export enum StockAvailability" src/gql/graphql.ts

# Check an input type
grep -A 30 "^export type ProductFilterInput" src/gql/graphql.ts
```

This file is generated by `pnpm generate` via API introspection, so it always matches your exact Saleor version. It contains the **full schema** (all types, enums, inputs), not just the ones used in declared queries.

## Common Issues

### Permission Errors

If you see:

```
"To access this path, you need one of the following permissions: MANAGE_..."
```

The field requires admin permissions and isn't available to anonymous/customer tokens. Either remove it from the storefront query, or fetch it server-side with `SALEOR_APP_TOKEN` and the required permission.

### Nullable Fields

Saleor's schema has many nullable fields. Handle nulls intentionally -- use optional chaining with a fallback for display values, but guard or throw when null signals a real problem:

```typescript
// Display value with fallback
const name = product.category?.name ?? "Uncategorized";

// Guard when null means something is wrong
if (!product.defaultVariant) {
	throw new Error(`Product ${product.slug} has no default variant`);
}
```

---

## Anti-patterns

❌ **Don't edit generated files** (`src/gql/` or `src/checkout/graphql/generated/`)  
❌ **Don't forget to regenerate types** - Run the appropriate `generate` command  
❌ **Don't assume fields are non-null** - Check generated types and handle nulls explicitly  
❌ **Don't mix up the two codegen setups** - Storefront ≠ Checkout

---

### 1.3 Auth Routes (BFF)

**Impact: CRITICAL** when `cacheComponents: true` and routes read session cookies.

Reference implementation: `src/app/[channel]/(main)/account/`.

> **Fork upgrades:** Apply atomic migration `2026-06-account-ppr-auth` in [`../migrations/manifest.json`](../migrations/manifest.json) when catching up from pre–June 2026 Paper (especially after #1201-style layout changes).

## Problem

With Cache Components enabled, any server component that calls `cookies()`, `headers()`, or authenticated GraphQL (`cache: "no-cache"` with session) is **dynamic**. If that runs in an async **page** without a Suspense boundary, production builds fail:

```
Uncached data was accessed outside of <Suspense>
```

Do **not** fix this by wrapping `<main>{children}</main>` in Suspense — that hides the issue and blocks route `loading.tsx`. Fix at the **route segment** that owns the dynamic work.

## BFF auth (session lifecycle)

Login, logout, and password reset go through **Next.js API routes** — not the browser Saleor SDK. Tokens are stored as **HttpOnly** cookies via `getServerAuthClient()` on the server.

| Route                           | Purpose                         |
| ------------------------------- | ------------------------------- |
| `POST /api/auth/login`          | `tokenCreate` → Set-Cookie      |
| `POST /api/auth/register`       | Account registration            |
| `POST /api/auth/reset-password` | Request reset email             |
| `POST /api/auth/set-password`   | Reset token → session           |
| `logout()` server action        | Clear cookies + detach checkout |

Client forms call `loginWithBff()` / `setPasswordWithBff()` from `src/lib/auth/bff-client.ts`. Commerce (cart, checkout lines) stays on **server actions** — do not proxy all GraphQL.

**Header user menu:** `UserMenuServer` calls `getHeaderUser()` inside Suspense — same server session as account pages. No client `me` fetch.

## Keeping header chrome fresh (Router Cache)

HttpOnly cookies are the source of truth, but the **client Router Cache** can reuse a stale RSC payload for the header after session changes. Paper uses three explicit triggers — no client-side retry loops:

| Trigger                           | When                                           | Mechanism                                                                                         |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Initial load / hard refresh**   | Land on storefront with existing session       | `HeaderAuthRefresh` → `revalidateStorefrontChrome` + `router.refresh()` once on mount             |
| **In-store soft nav**             | User follows a `<Link>` within `/${channel}`   | `HeaderAuthRefresh` → `router.refresh()` on pathname change                                       |
| **Cross-tab**                     | User returns after login/logout in another tab | `visibilitychange` → `revalidateStorefrontChromeAction` + `router.refresh()`                      |
| **Cross-surface / auth boundary** | Login, logout, checkout → storefront           | `revalidateStorefrontChrome` + **hard navigation** (`window.location.assign` or plain `<a href>`) |

**Hard navigation** is required when leaving `/checkout` or after login/logout — soft `router.push` / `<Link>` can restore a cached anonymous `UserMenuServer`. Use `syncAuthSurfacesAfterSignIn({ redirectTo })`, `useLogout({ channel })`, `navigateToStorefrontHome()`, or `StorefrontHomeLink` (plain anchor).

**`revalidateStorefrontChrome(channel)`** invalidates `/${channel}` layout (user menu + cart badge) and `/checkout`. Call from server actions after cart mutations, checkout complete, or before client refresh — not during RSC render.

## Migration Checklist

Use this when moving a logged-in area (account, wishlist, etc.) to PPR-safe patterns:

1. **Layout owns auth gate** — one `Suspense` + async shell; call `hasAuthSession()` / `getCurrentUser()` only inside the shell.
2. **Sync page exports** — `export default function Page()` returns `<Suspense><AsyncContent /></Suspense>` for pages that fetch orders, etc.
3. **Profile data from layout** — fetch user once; expose via client `AccountProvider` + `useAccountUser()` for settings/addresses (avoids `cookies()` in every page).
4. **Nested Suspense for secondary fetches** — e.g. recent orders, order list, order detail (authenticated GraphQL in child async components).
5. **Login fallback** — use `AccountLogin` (`LoginForm` in Suspense); sign-in posts to `/api/auth/login`.
6. **Mutations + client context** — if UI reads user from layout context, use `revalidatePath("/account", "layout")` and `router.refresh()` on success (page-only revalidation leaves stale context).
7. **Verify build** — `STOREFRONT_CHANNELS=aud,default-channel pnpm run build` (CI may not run full build).

## Architecture

```
account/layout.tsx
└── Suspense fallback={<AccountSkeleton />}
    └── AccountShell (async)
        ├── no session / invalid user → <AccountLogin />  (LoginForm → BFF)
        └── user → AccountProvider
            ├── AccountNav (static client)
            └── {children}  (sync pages + nested Suspense islands)

header.tsx
└── Suspense
    └── HeaderAuthRefresh (client) → router.refresh() on pathname change
        └── UserMenuServer (async) → cookies() + getHeaderUser() or sign-in link
```

| Concern            | Location                                  | Notes                                                           |
| ------------------ | ----------------------------------------- | --------------------------------------------------------------- |
| Auth cookies check | `has-auth-session.ts`                     | Same lookup as auth SDK (`readAuthCookieValue`)                 |
| User profile       | `get-current-user.ts`                     | `React.cache()` — deduped per request                           |
| Header user        | `get-header-user.ts`                      | `getHeaderAuthState()` — guest / authenticated / unavailable    |
| Session resolution | `resolve-session-user.ts`                 | Classifies `me` fetch; one server retry on transient errors     |
| Auth failure codes | `session-auth-state.ts`                   | `isDefinitiveAuthFailure` — Saleor JWT codes + message fallback |
| BFF sign-in        | `bff-server.ts`, `/api/auth/login`        | HttpOnly cookies, rate limited                                  |
| Client forms       | `bff-client.ts`                           | `loginWithBff`, `setPasswordWithBff`                            |
| Client profile     | `account-context.tsx`                     | `useAccountUser()` for settings/addresses/overview              |
| Sign-in UI         | `account-login.tsx`                       | `LoginForm` in Suspense (no SDK provider)                       |
| Order fetches      | `recent-orders-section.tsx`, orders pages | Inside page-level Suspense                                      |

## Code Patterns

### Layout shell

```tsx
export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) return <AccountLogin />;
	const user = await getCurrentUser();
	if (!user) return <AccountLogin />;
	return <AccountProvider user={user}>{/* nav + children */}</AccountProvider>;
}
```

### Sync page + dynamic island

```tsx
export default function AccountOverviewPage() {
	return (
		<div>
			<AccountOverviewWelcome /> {/* useAccountUser() */}
			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>
		</div>
	);
}
```

### Server actions with layout context

```typescript
function revalidateAccountLayout() {
	revalidatePath("/account", "layout");
}
```

```tsx
// Client form after successful BFF login — prefer hard nav over soft push + refresh
await syncAuthSurfacesAfterSignIn(channel, router, {
	redirectTo: `/${channel}`,
});
```

## Anti-patterns

❌ **`cookies()` or `getCurrentUser()` in async page components** without a page/layout Suspense boundary  
❌ **Browser → Saleor for login or `me`** — use BFF routes and server `getHeaderUser()`  
❌ **`connection()` in account layout** — can break PPR with `CartProvider` in parent tree  
❌ **Blanket `<Suspense>{children}</Suspense>` on main layout** — workaround, not architecture  
❌ **`revalidatePath("/account/addresses", "page")` only** when addresses read `useAccountUser()` from layout  
❌ **`fallback={null}`** on account order Suspense — use section skeletons  
❌ **`key={pathname}` without `router.refresh()`** on header auth — remounting RSC children does not bust the Router Cache; stale anonymous menus persist until `revalidateStorefrontChrome`  
❌ **Client-side sessionStorage retry / recover gates** on header auth — fix cache boundaries server-side; never loop `router.refresh()` from effects  
❌ **Treating all `me === null` as signed out** — use `resolveSessionUser` (`guest` / `authenticated` / `unavailable`); only show login link on `guest`  
❌ **`<Link>` from checkout → storefront** when session may have changed — use plain `<a href>` or `navigateToStorefrontHome()`

## Related Rules

- `data-caching.md` — three-layer page model, no main Suspense, sync page shell
- `checkout-management.md` — checkout session via RSC + BFF sign-in + `router.refresh()`

## Files

| File                                                                 | Purpose                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| `src/app/[channel]/(main)/account/layout.tsx`                        | Suspense + auth gate                     |
| `src/app/[channel]/(main)/account/get-current-user.ts`               | Cached profile fetch                     |
| `src/lib/auth/has-auth-session.ts`                                   | Cookie presence check                    |
| `src/lib/auth/session-auth-state.ts`                                 | JWT failure classification + retry logic |
| `src/lib/auth/resolve-session-user.ts`                               | `resolveSessionUser()` wrapper           |
| `src/lib/auth/bff-server.ts`                                         | Server sign-in / sign-out                |
| `src/lib/auth/get-header-user.ts`                                    | Header `me` fetch                        |
| `src/app/api/auth/login/route.ts`                                    | BFF login endpoint                       |
| `src/ui/components/account/account-login.tsx`                        | Signed-out account login                 |
| `src/ui/components/account/account-context.tsx`                      | Client profile context                   |
| `src/ui/components/nav/components/user-menu/user-menu-server.tsx`    | Header auth chrome                       |
| `src/ui/components/nav/components/user-menu/header-auth-refresh.tsx` | Router Cache sync (soft nav + cross-tab) |
| `src/lib/auth/revalidate-storefront-chrome.ts`                       | Layout + checkout cache bust             |
| `src/lib/auth/sync-auth-surfaces-after-sign-in.ts`                   | Post-login cache bust + hard nav         |
| `src/app/[channel]/(main)/account/actions.ts`                        | Layout revalidation helper               |

---

## 2. Product Pages

**Impact: HIGH**

Product pages are the core shopping experience. PDP layout, variant selection, and filtering directly affect conversion and usability.

### 2.1 Product Detail Page

Product Detail Page architecture, image gallery/carousel, caching, and add-to-cart flow. Ensures correct PDP layout, variant-aware gallery, LCP optimization, and resilient error handling.

> **Sources**: [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching) · [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) · [Suspense](https://react.dev/reference/react/Suspense)

For variant selection logic specifically, see `product-variants.md`.

> **Start here:** Read the [Data Flow](#data-flow) section first - it explains how everything connects.

## Architecture Overview

```
ProductPage (sync export)
└── Suspense → ProductShell (params + getProductData only — never await searchParams)
    ├── breadcrumbs, h1, attributes, JSON-LD
    ├── <link rel="preload"> for default gallery LCP image
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)

Data: getProductData() with applyCacheProfile(CACHE_PROFILES.products)  ← catalog tier (~5 min)
```

### Key Principles

1. **Product data is cached** — `getProductData()` uses `"use cache"` + cache manifest profile
2. **Shell stays static** — `ProductShell` awaits `params` only; passes `searchParams` promise through
3. **Gallery and variant section are separate dynamic islands** — each in its own Suspense boundary
4. **Gallery shows variant images** — `VariantGalleryDynamic` reads `?variant=` from URL
5. **Errors are contained** — ErrorBoundary around variant section prevents full page crash

### Data Flow

**Read this first** - understanding how data flows makes everything else click:

```
URL: /us/products/blue-shirt?variant=abc123
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ ProductPage (sync) → Suspense → ProductShell                      │
│                                                                   │
│   1. await params → getProductData("blue-shirt", "us")            │
│      └──► "use cache" + CACHE_PROFILES.products ──► product data  │
│                                                                   │
│   2. Static shell: h1, breadcrumbs, attributes, JSON-LD, preload  │
│                                                                   │
│   3. Nested Suspense islands (each awaits searchParams):          │
│      • VariantGalleryDynamic ──► variant.media for gallery        │
│      • VariantSectionDynamic ──► price, selectors, add-to-cart      │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User selects different variant (e.g., "Red")                      │
│                                                                   │
│   router.push("?variant=xyz789")                                  │
│      └──► URL changes                                             │
│      └──► Page re-renders with new searchParams                   │
│      └──► Gallery shows red variant images                        │
│      └──► VariantSection shows red variant selected               │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User clicks "Add to bag"                                          │
│                                                                   │
│   <form action={addToCart}>                                       │
│      └──► Server Action executes                                  │
│      └──► Creates/updates checkout                                │
│      └──► revalidatePath("/cart")                                 │
│      └──► Cart drawer updates                                     │
└───────────────────────────────────────────────────────────────────┘
```

**Why this matters:**

- Product data is **cached** (fast loads)
- URL is the **source of truth** for variant selection
- Gallery reacts to URL changes **without client state**
- Server Actions handle mutations **without API routes**

## File Structure

```
src/app/[channel]/(main)/products/[slug]/
└── page.tsx                          # Main PDP page

src/ui/components/pdp/
├── index.ts                          # Public exports (client-safe only)
├── variant-gallery-dynamic.tsx       # Server: reads searchParams, renders ProductGallery
├── product-gallery.tsx               # Client: Embla carousel wrapper
├── variant-section-dynamic.tsx       # Variant selection + add to cart
├── variant-section-error.tsx         # Error fallback (Client Component)
├── add-to-cart.tsx                   # Add to cart button
├── sticky-bar.tsx                    # Mobile sticky add-to-cart
├── product-attributes.tsx            # Description/details accordion
└── variant-selection/                # Variant selection system
    └── ...                           # See product-variants rule

src/ui/components/ui/
├── carousel.tsx                      # Embla carousel primitives
└── image-carousel.tsx                # Reusable image carousel
```

## Image Gallery

### Features

- **Mobile**: Horizontal swipe (Embla Carousel) + dot indicators
- **Desktop**: Arrow navigation (hover) + thumbnail strip
- **LCP**: `<link rel="preload">` in `ProductShell` for default gallery image + `priority` on first carousel image
- **Variant-aware**: `VariantGalleryDynamic` resolves images from `searchParams.variant`

### How Variant Images Work

```tsx
// variant-gallery-dynamic.tsx — searchParams read here, NOT in ProductShell
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantId } = await searchParams;
	const selectedVariant = variantId ? product.variants?.find((v) => v.id === variantId) : null;
	const images = getGalleryImages(product, selectedVariant);
	return <ProductGallery images={images} productName={product.name} />;
}
// Priority: variant.media → product.media → thumbnail
```

### LCP Strategy

Keep LCP simple — no hero-in-fallback pattern:

1. **`ProductShell`** emits `<link rel="preload" as="image" fetchPriority="high">` for the default (non-variant) hero URL
2. **`ProductGallery`** / `ImageCarousel` sets `priority` on the first visible image
3. Variant-specific images load when the user selects a variant (acceptable trade-off)

### Customizing Gallery

```tsx
// image-carousel.tsx props
<ImageCarousel
	images={images}
	productName="..."
	showArrows={true} // Desktop arrow buttons
	showDots={true} // Mobile dot indicators
	showThumbnails={true} // Desktop thumbnail strip
	onImageClick={(i) => {}} // For future lightbox
/>
```

### Adding Zoom/Lightbox (Future)

Use the `onImageClick` callback:

```tsx
<ImageCarousel images={images} onImageClick={(index) => openLightbox(index)} />
```

## Caching Strategy

### Data Fetching

```tsx
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

async function getProductData(slug: string, channel: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	return await executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug: decodeURIComponent(slug), channel },
	});
}
```

**Note:** Do not add fetch-level `revalidate` here — the cache manifest profile + webhooks handle freshness. See `data-caching.md`.

### What's Cached vs Dynamic

| Part                     | Cached? | Why                                         |
| ------------------------ | ------- | ------------------------------------------- |
| Product data             | ✅ Yes  | `"use cache"` in `getProductData()`         |
| h1, breadcrumbs, JSON-LD | ✅ Yes  | Rendered in `ProductShell` from cached data |
| Default LCP preload URL  | ✅ Yes  | Derived from cached product media           |
| Gallery (variant images) | ❌ No   | `VariantGalleryDynamic` reads searchParams  |
| Variant section (price)  | ❌ No   | `VariantSectionDynamic` reads searchParams  |

### On-Demand Revalidation

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:my-product-slug"
```

## Error Handling

### ErrorBoundary Pattern

```tsx
<ErrorBoundary FallbackComponent={VariantSectionError}>
  <Suspense fallback={<VariantSectionSkeleton />}>
    <VariantSectionDynamic ... />
  </Suspense>
</ErrorBoundary>
```

**Why**: If variant section throws, user still sees:

- Product images ✅
- Product name ✅
- Description ✅
- "Unable to load options. Try again." message

### Server Action Error Handling

```tsx
async function addToCart() {
	"use server";
	try {
		// ... checkout logic
	} catch (error) {
		console.error("Add to cart failed:", error);
		// Graceful failure - no crash
	}
}
```

## Add to Cart Flow

```
User clicks "Add to bag"
        │
        ▼
┌─────────────────────┐
│ form action={...}   │ ← HTML form submission
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ addToCart()         │ ← Server Action
│ "use server"        │
│                     │
│ • Find/create cart  │
│ • Add line item     │
│ • revalidatePath()  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ useFormStatus()     │ ← Shows "Adding..." state
│ pending: true       │
└─────────────────────┘
        │
        ▼
   Cart drawer updates (via revalidation)
```

## Common Tasks

### Add new product attribute display

1. Check `ProductDetails.graphql` for field
2. If missing, add and run `pnpm run generate`
3. Extract in `page.tsx` helper function
4. Pass to `ProductAttributes` component

### Change gallery thumbnail size

Edit `image-carousel.tsx`:

```tsx
<button className="relative h-20 w-20 ...">  {/* Change h-20 w-20 */}
```

### Change sticky bar scroll threshold

Edit `sticky-bar.tsx`:

```tsx
const SCROLL_THRESHOLD = 500; // Change this value
```

### Add product badges (New, Sale, etc.)

Badges are in `VariantSectionDynamic`:

```tsx
{
	isOnSale && <Badge variant="destructive">Sale</Badge>;
}
```

## GraphQL

### Key Queries

- `ProductDetails.graphql` - Main product query
- `VariantDetailsFragment.graphql` - Variant data including media

### After GraphQL Changes

```bash
pnpm run generate  # Regenerate types
```

## Testing

```bash
pnpm test src/ui/components/pdp  # Run PDP tests
```

### Manual Testing Checklist

- [ ] Gallery swipe works on mobile
- [ ] Arrows appear on desktop hover
- [ ] Variant selection updates URL
- [ ] Variant images change when variant selected
- [ ] Add to cart shows pending state
- [ ] Sticky bar appears after scroll
- [ ] Error boundary catches failures

## Anti-patterns

❌ **Don't pass Server Component functions to Client Components**

```tsx
// ❌ Bad - VariantSectionError defined in Server Component file
<ErrorBoundary FallbackComponent={VariantSectionError}>

// ✅ Good - VariantSectionError in separate file with "use client"
// See variant-section-error.tsx
```

❌ **Don't read searchParams in ProductShell or cached functions**

```tsx
// ❌ Bad — collapses entire PDP into dynamic hole
async function ProductShell({ searchParams, ... }) {
	const { variant } = await searchParams;
	const product = await getProductData(...);
}

// ✅ Good — pass searchParams promise to dynamic islands only
<Suspense fallback={<GallerySkeleton />}>
  <VariantGalleryDynamic product={product} searchParams={searchParams} />
</Suspense>
```

```tsx
// ❌ Bad — breaks caching
async function getProductData(slug: string, searchParams: SearchParams) {
	"use cache";
	const variant = searchParams.variant;
}
```

❌ **Don't use useState for variant selection**

```tsx
// ❌ Bad - client state, not shareable, lost on refresh
const [selectedVariant, setSelectedVariant] = useState(null);

// ✅ Good - URL is source of truth
router.push(`?variant=${variantId}`);
// Read from searchParams on server
```

❌ **Don't skip ErrorBoundary around Suspense**

```tsx
// ❌ Bad - error crashes entire page
<Suspense fallback={<Skeleton />}>
  <DynamicComponent />
</Suspense>

// ✅ Good - error contained, rest of page visible
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Suspense fallback={<Skeleton />}>
    <DynamicComponent />
  </Suspense>
</ErrorBoundary>
```

❌ **Don't use index as key for images**

```tsx
// ❌ Bad - breaks React reconciliation when images change
{images.map((img, index) => <Image key={index} ... />)}

// ✅ Good - stable key
{images.map((img) => <Image key={img.url} ... />)}
```

---

### 2.2 Variant Selection

Variant and attribute selection on product detail pages. Ensures correct "Add to Cart" button state, option availability, discount badges, and URL-driven selection.

> **Source**: [Saleor Docs - Attributes](https://docs.saleor.io/developer/attributes/overview) - How product/variant attributes work

> **UI & renderers:** For border states, swatch pills, sizing, and renderer routing, see
> [../references/variant-selector-ui.md](../references/variant-selector-ui.md).

## Core Concept: Variants, Not Products

**You add VARIANTS to cart, not products.** Each variant is a specific attribute combination:

| Product | Attributes     | Variant ID |
| ------- | -------------- | ---------- |
| T-Shirt | Black + Medium | `abc123`   |
| T-Shirt | Black + Large  | `def456`   |
| T-Shirt | White + Medium | `ghi789`   |

The `checkoutLinesAdd` mutation requires a specific `variantId`. Without selecting ALL attributes, there's no variant to add.

## Two Types of Variant Attributes

Saleor distinguishes between two types of variant attributes:

| Type              | `variantSelection`      | Purpose                                | UI                  | Passed to Cart?           |
| ----------------- | ----------------------- | -------------------------------------- | ------------------- | ------------------------- |
| **Selection**     | `VARIANT_SELECTION`     | Identify which variant (color, size)   | Interactive picker  | No - just the `variantId` |
| **Non-Selection** | `NOT_VARIANT_SELECTION` | Describe the variant (material, brand) | Display-only badges | No - already on variant   |

**Key insight:** Neither type is "passed" to checkout. You only pass the `variantId`. All attributes are already stored on the variant in Saleor.

```graphql
# GraphQL queries use the variantSelection filter:
selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) { ... }
nonSelectionAttributes: attributes(variantSelection: NOT_VARIANT_SELECTION) { ... }
```

Non-selection attributes are **display-only** - shown as informational badges, not interactive selectors.

## Saleor Swatch Attributes

Saleor `inputType: SWATCH` attributes may provide a **hex color** (`value`), an **image** (`file.url`), or both. Common on demo catalog for Color and Audio quality.

Required GraphQL on `VariantDetailsFragment.graphql`:

```graphql
values {
  name
  value
  file { url }
}
attribute {
  slug
  name
  inputType
}
```

After changes: `pnpm run generate`.

| Swatch data    | Renderer                | UI                                |
| -------------- | ----------------------- | --------------------------------- |
| `file.url`     | `ImageSwatchPillOption` | `h-12` labeled pill (icon + name) |
| hex in `value` | `ColorSwatchOption`     | `h-12` circle                     |

See [variant-selector-ui.md](../references/variant-selector-ui.md) for border/state classes.

## File Structure

```
src/ui/components/pdp/variant-selection/
├── index.ts
├── types.ts
├── utils.ts
├── variant-selector.tsx
├── variant-selection-section.tsx
├── optional-attributes.tsx
└── renderers/
    ├── color-swatch-option.tsx      # Hex swatch circles
    ├── image-swatch-pill-option.tsx # Image swatch pills
    ├── button-option.tsx            # Size/text buttons
    └── index.ts                     # defaultRenderers registry
```

## Key Functions in `utils.ts`

| Function                        | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `groupVariantsByAttributes()`   | Extract unique attribute values from variants  |
| `findMatchingVariant()`         | Find variant matching ALL selected attributes  |
| `hasCompatibleVariant()`        | Any variant matches partial selections         |
| `getOptionsForAttribute()`      | Options with availability + compatibility info |
| `getAdjustedSelections()`       | Partial accumulation + conflict auto-clear     |
| `getUnavailableAttributeInfo()` | Detect dead-end selections                     |
| `normalizeAttributeValueId()`   | Value name → URL option id                     |

For detailed function signatures, see [../references/variant-utils-reference.md](../references/variant-utils-reference.md).

## Option States

| State            | Meaning                                 | Visual (buttons/pills)      | Clickable?        |
| ---------------- | --------------------------------------- | --------------------------- | ----------------- |
| **Compatible**   | Works with current other selections     | `border-gray-400`           | ✓                 |
| **Selected**     | Currently chosen                        | `border-foreground`, fill   | ✓                 |
| **Incompatible** | No variant with this + other selections | `border-gray-200`, muted    | ✓ (clears others) |
| **Out of stock** | Variant exists but quantity = 0         | strikethrough, `opacity-60` | ✗                 |

Compatibility flag: `existsWithCurrentSelection` from `getOptionsForAttribute()`.

**Do not** use `border-border` for default compatible buttons — too light (see variant-selector-ui.md).

## Partial vs Complete Selection

| Phase                                   | `findMatchingVariant` | `getAdjustedSelections` behavior                            |
| --------------------------------------- | --------------------- | ----------------------------------------------------------- |
| **Partial** (some groups empty)         | `undefined`           | **Keep** new + prior selections if `hasCompatibleVariant()` |
| **Complete** (all groups filled, match) | variant id            | Keep all; set `?variant=`                                   |
| **Complete** (all filled, no match)     | `undefined`           | AUTO_ADJUST: clear to `{ [clickedAttr]: value }` only       |

**Bug to avoid:** Calling `findMatchingVariant()` alone to decide whether to keep partial selections — it always returns `undefined` until every attribute group is filled.

Multi-attribute example (demo audiobooks): Medium + Audio quality + Instant Delivery — user must select all three before add to cart enables.

## URL Parameter Pattern

```
?medium=mp3&audio-quality=standard&instant-delivery=instant-delivery:-yes&variant=abc123
```

The `variant` param is only set when ALL attributes are selected and a match exists.

## Discount Badges

Options can show discount percentages on any renderer (`discountPercent` on `VariantOption`). Badge: small red pill at bottom-right of the option control.

## Examples

### Smart Selection Adjustment (complete selection only)

```
State: ?color=red&size=s (all attrs filled, but user clicks Size L)
Red/L doesn't exist → AUTO_ADJUST → ?size=l (color cleared)
```

### Building partial selection (multi-attribute)

```
1. Click Medium → MP3     → ?medium=mp3
2. Click Standard         → ?medium=mp3&audio-quality=standard  (medium kept!)
3. Click Instant Delivery → complete → ?variant=... added
```

### Custom Renderers

```tsx
<VariantSelectionSection
	variants={variants}
	renderers={{
		color: MyCustomColorPicker,
		size: MySizeChart,
	}}
/>
```

## State Machine

For the full state diagram and transition rules, see [../references/variant-state-machine.md](../references/variant-state-machine.md).

| State        | Add to Cart | Description                    |
| ------------ | ----------- | ------------------------------ |
| **Empty**    | ❌          | No selections                  |
| **Partial**  | ❌          | Some attributes selected       |
| **Complete** | ✅          | All selected, variant found    |
| **Conflict** | —           | All filled, impossible → clear |
| **DeadEnd**  | ❌          | Selection blocks other groups  |

## Testing

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Fixture `audiobookVariants` in `__fixtures__/variants.ts` covers 3-attribute partial selection.

## Anti-patterns

❌ **Don't enable "Add to Cart" without full selection** - Needs variant ID  
❌ **Don't block incompatible options** - Let users click, clear others when complete  
❌ **Don't clear partial selections** when `findMatchingVariant` is undefined — use `hasCompatibleVariant`  
❌ **Don't assume single attribute** - Products can have multiple (incl. BOOLEAN selection attrs)  
❌ **Don't use `0` in boolean checks for prices** - Use `typeof === "number"`  
❌ **Don't make non-selection attributes interactive** - They're display-only (badges, not toggles)  
❌ **Don't use `border-border` on compatible button/pill options** - Use `border-gray-400`

---

### 2.3 Product Filtering

Product list filtering and sorting architecture. Ensures correct server-side vs client-side filtering, category resolution, static price ranges, and filter UI behavior.

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) - Available server-side filter options

## Filter Architecture

| Filter         | Processing     | Why                                           |
| -------------- | -------------- | --------------------------------------------- |
| **Categories** | ✅ Server-side | Uses Saleor's `ProductFilterInput.categories` |
| **Price**      | ✅ Server-side | Uses Saleor's `ProductFilterInput.price`      |
| **Sort**       | ✅ Server-side | Uses Saleor's `ProductOrder`                  |
| **Colors**     | ❌ Client-side | Saleor needs attribute IDs                    |
| **Sizes**      | ❌ Client-side | Same as colors                                |

## Key Files

| File                                           | Purpose                                |
| ---------------------------------------------- | -------------------------------------- |
| `src/ui/components/plp/filter-utils.ts`        | All filter utilities (server + client) |
| `src/ui/components/plp/filter-bar.tsx`         | Filter UI (dropdowns, mobile sheet)    |
| `src/ui/components/plp/use-product-filters.ts` | Hook consolidating filter logic        |

## Server-Side Filtering

Category slugs in URL are resolved to IDs:

```typescript
// In page.tsx (server component)
import { resolveCategorySlugsToIds, buildFilterVariables } from "@/ui/components/plp/filter-utils";

const categorySlugs = searchParams.categories?.split(",") || [];
const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

const filter = buildFilterVariables({
	priceRange: searchParams.price,
	categoryIds,
});

// Pass to GraphQL query
const { products } = await executePublicGraphQL(ProductListDocument, {
	variables: { channel, filter },
});
```

## Client-Side Filtering

Colors and sizes are filtered after fetch:

```typescript
import { filterProducts, extractColorOptions } from "@/ui/components/plp/filter-utils";

// Extract available options
const colorOptions = extractColorOptions(products, selectedColors);

// Apply filters
const filtered = filterProducts(products, {
	colors: selectedColors,
	sizes: selectedSizes,
});
```

## Using the Hook

The `useProductFilters` hook consolidates all filter logic:

```tsx
"use client";
import { useProductFilters } from "@/ui/components/plp/use-product-filters";

function ProductsClient({ products, resolvedCategories }) {
	const {
		filteredProducts,
		colorOptions,
		sizeOptions,
		selectedColors,
		handleColorToggle,
		handleSortChange,
		activeFilters,
	} = useProductFilters({
		products,
		resolvedCategories,
		enableCategoryFilter: true,
	});

	return (
		<FilterBar
			colorOptions={colorOptions}
			selectedColors={selectedColors}
			onColorToggle={handleColorToggle}
			// ...
		/>
	);
}
```

## Static Price Ranges

Price ranges are static to avoid UI flicker when filtering:

```typescript
import { STATIC_PRICE_RANGES_WITH_COUNT } from "@/ui/components/plp/filter-utils";

// Returns: [
//   { label: "Under $50", value: "0-50", count: 0 },
//   { label: "$50 - $100", value: "50-100", count: 0 },
//   ...
// ]
```

## Examples

### Adding a New Server-Side Filter

1. Update `buildFilterVariables` in `filter-utils.ts`:

```typescript
export function buildFilterVariables(params: {
	priceRange?: string | null;
	categoryIds?: string[];
	inStock?: boolean; // New filter
}): ProductFilterInput | undefined {
	// ... existing code ...

	if (params.inStock) {
		filter.stockAvailability = "IN_STOCK";
		hasFilter = true;
	}
}
```

2. Parse from URL in page.tsx and pass to the function.

## Anti-patterns

❌ **Don't filter categories client-side** - Use server-side with IDs  
❌ **Don't generate dynamic price ranges** - Use static ranges  
❌ **Don't hide selected filters** - Always show so users can deselect

---

## 3. Checkout Flow

**Impact: HIGH**

Checkout handles payment and order completion. Bugs here directly cause lost revenue and poor user experience.

### 3.1 Paper Surfaces

One Next.js project, two product surfaces, one shared handoff package.

## Documentation map (checkout v2)

| Read first                                                                                        | When                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **This file**                                                                                     | Where code lives, import boundaries, routes                 |
| [`checkout-management.md`](checkout-management.md)                                                | Cart sync, step URLs, payment → order transition, debugging |
| [`checkout-payment-gateways.md`](checkout-payment-gateways.md)                                    | Adding or changing payment apps                             |
| [`checkout-components.md`](checkout-components.md)                                                | Reusable step UI (contact, address, billing)                |
| [`data-auth-routes.md`](data-auth-routes.md)                                                      | BFF login, `resolveSessionUser`, header chrome refresh      |
| [`migrations/atomic/2026-06-checkout-v2/`](../migrations/atomic/2026-06-checkout-v2/MIGRATION.md) | Fork upgrade from urql checkout                             |

## Layout

```text
src/app/
  (storefront)/[channel]/...   # Browse, cart, account — URL: /{channel}/...
  (checkout)/checkout/...      # Checkout — /checkout?checkout=…, confirmation — /checkout/complete?order=…

src/session-bridge/            # @paper/session-bridge — only cross-surface import
src/checkout/                  # Checkout UI + GraphQL (not imported by storefront)
src/lib/auth/                  # BFF session (shared); server actions for commerce
```

Route groups `(storefront)` and `(checkout)` do not appear in URLs; they separate root layouts and ownership.

## Checkout v2 data flow

```
/checkout?checkout=Q2hlY2…
        │
        ▼
CheckoutSessionLoader (RSC)     ← reads ?checkout= only (not ?step=)
        │  fetch checkout, me, countries
        ▼
CheckoutApp (client)
        │  CheckoutDataProvider ← initialCheckout hydrate
        │  CheckoutUserProvider ← initialUser
        ▼
SaleorCheckout (steps)          ← ?step= via shallow updateCheckoutQuery()
        │
        ▼
actions.ts (server)             ← mutations, payment transactions, checkoutComplete
        │
        ▼
/checkout/complete?order=       ← hard navigation after payment (separate route)
```

## Data and caching

| Surface    | GraphQL                                                         | Freshness                          |
| ---------- | --------------------------------------------------------------- | ---------------------------------- |
| Storefront | `executePublicGraphQL` / `executeAuthenticatedGraphQL`          | Display cached (`"use cache"`)     |
| Checkout   | RSC page + server actions (`execute*GraphQL`)                   | Always fresh (`cache: "no-cache"`) |
| Auth       | `POST /api/auth/*` + `getServerAuthClient()` (HttpOnly cookies) | Always fresh                       |

`CheckoutSessionLoader` passes `initialCheckout` when `loadState === "ready"`. Order confirmation is a separate route (`checkout/complete/page.tsx` + `OrderConfirmationApp` — no cart context). Client `syncCheckoutFromServer` is a narrow fallback; normal path is RSC hydrate + `adoptCheckoutSnapshot` on refresh.

## Session (shared BFF)

Login, logout, and password reset use **Next.js API routes** — not browser Saleor SDK. Checkout and storefront share the same HttpOnly cookies.

| Concern                    | Location                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Sign-in                    | `POST /api/auth/login` via `loginWithBff()`                                       |
| Classify `me` fetch        | `resolveSessionUser()` → `guest` / `authenticated` / `unavailable`                |
| JWT expiry detection       | `session-auth-state.ts` — structured Saleor codes (`ExpiredSignatureError`, etc.) |
| After sign-in in checkout  | `router.refresh()` or `useRefreshCheckoutRsc()`                                   |
| After sign-in → storefront | `syncAuthSurfacesAfterSignIn()` — hard nav + `revalidateStorefrontChrome`         |
| Cart/checkout cache bust   | `revalidateAuthSurfaces` after cart mutations                                     |

See `data-auth-routes.md` for Router Cache pitfalls (stale header menu) and when hard navigation is required.

## Handoff

1. Storefront creates/updates cart via `src/lib/checkout.ts` (cookie via `checkoutIdCookieName`).
2. Cart links use `buildCheckoutPath` / `buildCheckoutUrl`; post-payment navigation uses `buildOrderConfirmationPath` from `@paper/session-bridge`.
3. Checkout reads session from URL (`?checkout=`) via `getQueryParams` / `extractCheckoutIdFromParams`.

## Checkout entry

- Route: `src/app/(checkout)/checkout/page.tsx` → `CheckoutSessionLoader`
- Client root: `CheckoutApp` in `src/checkout/checkout-app.tsx` (providers only — no urql/SDK)
- Mutations: `src/app/(checkout)/actions.ts`
- Do not wrap the whole checkout tree in `dynamic(..., { ssr: false })`

## Hosted checkout-only deploy (optional)

- **Middleware + env**: block non-`/checkout` routes on the same build.
- **Fork**: omit `app/(storefront)/` for a smaller artifact.
- Set `NEXT_PUBLIC_CHECKOUT_URL` so `buildCheckoutUrl` returns absolute links from storefront.

## Anti-patterns

❌ Storefront importing `@/checkout/views` or checkout hooks  
❌ Duplicated `/checkout?checkout=` string literals — use `@paper/session-bridge`  
❌ Browser → Saleor for login or header `me` — use BFF + `getHeaderUser()`  
❌ `searchParams` inside `"use cache"` functions on the storefront  
❌ `router.replace` for checkout step-only changes — use `updateCheckoutQuery()`  
❌ Treating all `me === null` as signed out — use `resolveSessionUser` states

---

### 3.2 Checkout Management

Understanding checkout session lifecycle, storage, and debugging prevents payment failures, hydration mismatches, and "CHECKOUT_NOT_FULLY_PAID" errors. Use live checkout data for payment amounts and handle stale checkouts gracefully.

---

## Overview

This skill covers how checkout sessions are created, stored, and managed in the Saleor storefront.

## Checkout ID Storage

Checkout IDs are stored in **two places**:

### 1. Cookie (Primary Storage)

```
Cookie name: checkoutId-{channel}
Example: checkoutId-default-channel
```

The cookie is set in `src/lib/checkout.ts`:

```typescript
export async function saveIdToCookie(channel: string, checkoutId: string) {
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}
```

### 2. URL Query Parameter

```
URL: /checkout?checkout=Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm
```

The checkout ID is a base64-encoded Saleor global ID.

## Checkout Lifecycle

### Creation

A new checkout is created when:

- User adds first item to an empty cart
- No valid checkout ID exists in cookie
- Existing checkout is not found in Saleor

```typescript
// src/lib/checkout.ts
export async function findOrCreate({ channel, checkoutId }) {
	if (!checkoutId) {
		return (await create({ channel })).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create({ channel })).checkoutCreate?.checkout;
}
```

### Persistence

The checkout persists across:

- Page refreshes
- Browser sessions (cookie-based)
- Cart modifications

### Completion

When `checkoutComplete` mutation succeeds:

- Checkout is converted to an Order
- The checkout ID becomes invalid
- A new checkout should be created for future purchases

## Checkout auth (BFF)

Sign-in during checkout uses the same BFF as storefront (`POST /api/auth/login` via `loginWithBff()`). `CheckoutUserProvider` hydrates `me` from the RSC page; after sign-in, call `refetchUser()` → `router.refresh()` so the server re-fetches the session. Sign-out uses the `logout()` server action + `detachCheckoutCustomer` when needed.

See `data-auth-routes.md` for HttpOnly cookies, header `getHeaderUser()`, and rate limits.

## Data loading (RSC + client sync)

1. **RSC page** (`checkout/page.tsx`) — full checkout (`fetchCheckoutOnServer`), `me`, order, channel countries. Passes `initialCheckout` when `loadState === "ready"`.
2. **Client** — `CheckoutDataProvider` hydrates from `initialCheckout` (`CheckoutSessionLoader` always pairs `ready` with a snapshot). RSC updates merge via `adoptCheckoutSnapshot`; explicit `refreshCheckout()` replaces state. Cart mutations revalidate `/checkout` via `revalidateStorefrontChrome`. Use `useRefreshCheckoutRsc()` after auth or address-book changes.
3. **Mutations** — `src/app/(checkout)/actions.ts` server actions; `refreshCheckout` / `adoptCheckoutSnapshot` in `checkout-sync.ts`.

`useCheckout()` reads from `CheckoutDataProvider` context (not urql).

## Payment completion and transition UX

Gateway-agnostic infrastructure shared by Dummy, Stripe, and future payment apps. Provider-specific SDK steps live in `checkout-payment-gateways.md`; this section covers what happens **after** the PSP authorizes payment through Saleor.

### Flow

```
User clicks Pay (or returns from 3DS redirect)
        │
        ▼
markPaymentCompleting(checkoutId)     ← sessionStorage: checkout:payment-completing
        │
        ▼
transactionInitialize / process       ← provider-specific (may already be done)
        │
        ▼
finalizeCheckoutOrder()               ← runCheckoutComplete mutation
        │
        ├── failure → clearPaymentCompleting(), show error
        │
        └── success → navigateToOrderConfirmation(orderId)
                      window.location.replace(/checkout/complete?order=…)
        │
        ▼
Order confirmation page (`/checkout/complete`) ← clearPaymentCompleting()
                                               checkout cookie cleared in runCheckoutComplete
```

### Routes and transition storage

| Mechanism                          | Purpose                                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/checkout?checkout=`              | Active cart flow — `CheckoutApp` + step UI                                                                                                           |
| `/checkout/complete?order=`        | Order confirmation — separate RSC page + `OrderConfirmationApp`                                                                                      |
| `checkout:payment-completing`      | Keeps checkout on `PaymentCompletingScreen` while `checkoutComplete` runs — avoids flashing back to step 1                                           |
| `?processingPayment=true`          | Stripe 3DS return URL flag; works with `isCheckoutPaymentActive()` when payment step is unmounted                                                    |
| `window.location.replace`          | Navigates to `/checkout/complete` — hard navigation required; `router.replace` from async post-mutation callbacks does not reliably unmount checkout |
| `?step=contact\|shipping\|payment` | Checkout step deep link; URL is the source of truth via `useLiveCheckoutSearchParams()`                                                              |
| `updateCheckoutQuery()`            | Shallow step URL updates (`pushState` on Continue, `replaceState` on stepper) — avoids re-running checkout RSC; merges into the live URL bar         |

**Do not** clear the checkout cookie synchronously on `/checkout?checkout=…` after payment succeeds — Next.js re-renders the checkout RSC tree when the cookie changes, which briefly shows `not_found` ("session expired") before navigation lands. `runCheckoutComplete` clears the cookie in `after()`; the client calls `navigateToOrderConfirmation()`. `RootViews` keeps `PaymentCompletingScreen` up while `checkout:payment-completing` is set. Do **not** call `redirect()` from `runCheckoutComplete` — it throws `NEXT_REDIRECT`, which Stripe payment catch blocks surface as a false "Payment failed" banner.

### Checkout step URL (shallow navigation)

Step changes inside `/checkout` use **`updateCheckoutQuery({ step })`** (`src/checkout/lib/checkout-search-params.ts`), not `router.replace`. App Router treats `searchParams` as dynamic page input — a router navigation would re-fetch checkout on every step click. Shallow history updates the URL for back/refresh/deep links without a server round-trip.

- **Continue (step complete)** — `history: "push"` so browser Back walks Contact → Shipping → Payment.
- **Header stepper / inline Back** — default `replace` so jumping steps does not stack fake history entries.
- **Stripe URL cleanup** — default `replace` when clearing `processingPayment` params.

`useLiveCheckoutSearchParams()` (`useSyncExternalStore`) keeps step UI, payment transition guards, and Stripe return detection in sync with shallow updates and `popstate`. Ephemeral Stripe return params are preserved by merging from `window.location.search`, never from stale React `searchParams` alone.

**RSC session boundary:** `CheckoutSessionLoader` (`checkout-session-loader.tsx`) reads only `?checkout=` / `?order=` — never `?step=`. Fetches use `get-checkout-session-data.ts` (`React.cache` per checkout id) so an accidental page re-run dedupes within the request.

Use `router.replace` for **in-checkout** navigations (orphaned checkout recovery changing `?checkout=`). Order confirmation uses `window.location.replace` via `navigateToOrderConfirmation()`.

### Transition guard

`useCheckoutTransition()` (used in `saleor-checkout.tsx`) returns:

| Value          | When                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `"completing"` | `isCheckoutPaymentActive()` — storage key matches checkout id or `processingPayment` param |
| `null`         | Normal checkout UI                                                                         |

When `transition === "completing"`, render `PaymentCompletingScreen` instead of the step flow.

### Stripe 3DS / redirect return

`StripeCheckoutReturnHandler` mounts at the **checkout shell** (`stripe-checkout-completion-host.tsx`), not inside the payment step. After redirect, the payment step may be unmounted — shell-level completion avoids losing the return handler. Real failures clear Stripe return URL params, exit the processing screen, and show `PaymentError` **inline on the payment step** (not as a banner above the processing overlay).

Return URL includes `processingPayment`, `paymentIntent`, and `paymentIntentClientSecret` query params (see `build-stripe-return-url.ts`).

### Live total before charge

Before any `transactionInitialize`, payment flows:

1. Call `updateCheckoutBilling()`
2. `refreshCheckout()` for a live gross total
3. If `hasMaterialCheckoutTotalChange(displayed, live)` → show price-change notice and **block** pay

Saleor validates amounts at `checkoutComplete`, but blocking early avoids authorizing the wrong amount. See `checkout-pay-amount.ts`.

### Key files

| File                                                                        | Purpose                                            |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| `src/app/(checkout)/checkout/checkout-session-loader.tsx`                   | Active checkout RSC entry (`?checkout=` only)      |
| `src/checkout/lib/server/get-checkout-session-data.ts`                      | Per-request cached session fetches                 |
| `src/app/(checkout)/checkout/complete/page.tsx`                             | Order confirmation RSC entry                       |
| `src/checkout/order-confirmation-app.tsx`                                   | Confirmation client shell                          |
| `src/checkout/lib/payment/checkout-payment-completion.ts`                   | `markPaymentCompleting`, `isCheckoutPaymentActive` |
| `src/checkout/lib/payment/finalize-checkout-order.ts`                       | Deduped `checkoutComplete` + navigation            |
| `src/checkout/lib/payment/navigate-to-order.ts`                             | Nav to `/checkout/complete?order=`                 |
| `src/checkout/hooks/use-checkout-transition.ts`                             | `completing` guard                                 |
| `src/checkout/views/saleor-checkout/payment-completing-screen.tsx`          | Full-page "Processing your order" UI               |
| `src/checkout/components/payment/stripe/stripe-checkout-return-handler.tsx` | Post-redirect completion                           |
| `src/checkout/views/order-confirmation/order-confirmation.tsx`              | Clears completion storage on mount                 |

### Anti-patterns

❌ **Don't call `router.push`/`replace` directly for order confirmation** — use `navigateToOrderConfirmation()`  
❌ **Don't clear checkout cookie before leaving `?checkout=`** — wait for order confirmation  
❌ **Don't mount redirect completion only inside payment step** — shell survives step unmount  
❌ **Don't skip `clearPaymentCompleting()` on payment failure** — user must be able to retry

## Common Issues

### Stale cart after editing from storefront

**Problem**: User changes cart on `/{channel}/cart`, returns to checkout — old lines or totals.

**Fix**: Cart server actions call `revalidateStorefrontChrome`, which includes `revalidatePath("/checkout")`, so the next checkout navigation gets a fresh RSC `initialCheckout`. In-flow updates use `refreshCheckout` (full replace).

### Stale Checkout with Failed Transactions

**Problem**: If payment fails multiple times, the checkout accumulates partial transactions. Subsequent payment attempts may fail with:

```
CHECKOUT_NOT_FULLY_PAID: The authorized amount doesn't cover the checkout's total amount.
```

**Solutions**:

1. **Clear cookies** - Delete `checkoutId-{channel}` cookie
2. **Use incognito** - Test in a private browser window
3. **Remove URL param** - Navigate to checkout without `?checkout=XXX`

### Checkout Amount Mismatch

**Problem**: Checkout total changes after transactions are initialized (e.g., shipping added).

**Solution**: Always use live checkout from `useCheckout()` / `CheckoutDataProvider` before payment — never cached PDP prices.

## Key Files

| File                                                  | Purpose                              |
| ----------------------------------------------------- | ------------------------------------ |
| `src/lib/checkout.ts`                                 | Checkout creation, cookie management |
| `src/app/(checkout)/checkout/page.tsx`                | RSC entry, routing + `me`            |
| `src/app/(checkout)/actions.ts`                       | Checkout server actions              |
| `src/checkout/providers/checkout-data.tsx`            | Client cart state + sync             |
| `src/checkout/lib/checkout-sync.ts`                   | adopt vs refresh semantics           |
| `src/checkout/hooks/use-checkout.ts`                  | Context hook for steps               |
| `src/checkout/hooks/use-checkout-transition.ts`       | Payment → order transition guard     |
| `src/checkout/lib/payment/finalize-checkout-order.ts` | `checkoutComplete` + navigation      |
| `src/checkout/lib/utils/url.ts`                       | URL query param extraction           |

## Debugging Checkout Issues

### 1. Check Current Checkout ID

```javascript
// In browser console
document.cookie.split(";").find((c) => c.includes("checkoutId"));
```

### 2. Decode Checkout ID

```javascript
// Base64 decode the checkout ID from URL
atob("Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm");
// Returns: "Checkout:a8c7f8b8-fe45-4e4d-8afb-d7cab6a3917f"
```

### 3. Query Checkout in Saleor

Use GraphQL playground to inspect checkout state:

```graphql
query {
	checkout(id: "Q2hlY2tvdXQ6...") {
		id
		totalPrice {
			gross {
				amount
				currency
			}
		}
		transactions {
			id
			chargedAmount {
				amount
			}
			authorizedAmount {
				amount
			}
		}
	}
}
```

## Payment App Issues

### Transaction Fails with "AUTHORIZATION_FAILURE"

**Symptom**: Transaction is created but fails immediately:

```json
{
	"transaction": { "id": "...", "actions": [] },
	"transactionEvent": {
		"message": "Failed to delivery request.",
		"type": "AUTHORIZATION_FAILURE"
	}
}
```

**Cause**: The payment app (e.g., Dummy Gateway, Stripe, Adyen) is not responding.

**Solutions**:

1. Check **Saleor Dashboard → Apps** - is the payment app active/healthy?
2. Check if the payment app URL is accessible
3. Restart the payment app if self-hosted
4. Check Saleor Cloud status if using cloud-hosted apps

### "CHECKOUT_NOT_FULLY_PAID" Error

**Symptom**: `checkoutComplete` fails with:

```
The authorized amount doesn't cover the checkout's total amount.
```

**Causes**:

1. **Payment app is down** - transaction was created but authorization failed
2. **Stale checkout** - previous partial transactions exist
3. **Amount mismatch** - checkout total changed after transaction init

**Debug steps**:

1. Check `[Payment] Transaction init result:` logs for `transactionEvent.type`
2. If `AUTHORIZATION_FAILURE` → payment app is down/unreachable
3. If transaction succeeded but amount is wrong → checkout data is stale

## Best Practices

1. **Always use live checkout data** for payment amounts
2. **Handle checkout not found** gracefully (create new checkout)
3. **Clear checkout after completion** to avoid stale data
4. **Test with fresh checkouts** when debugging payment issues
5. **Check payment app health** when transactions fail with `AUTHORIZATION_FAILURE`

---

## Appendix: Checkout v2 cheat sheet

Quick reference for common tasks. Full surface layout: [`paper-surfaces.md`](paper-surfaces.md).

### When to use which refresh

| Goal                                                   | Mechanism                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Re-fetch cart after promo / line change in checkout    | `refreshCheckout()` — always replaces client state                                                   |
| Pick up RSC snapshot after cart edit on storefront     | Automatic via `revalidateAuthSurfaces` + next navigation; or `useRefreshCheckoutRsc()`               |
| Merge server snapshot without clobbering in-flow edits | `adoptCheckoutSnapshot` (on `initialCheckout` change only)                                           |
| Update `me` after BFF sign-in                          | `router.refresh()` in checkout; hard nav + `revalidateStorefrontChrome` when returning to storefront |
| Change checkout step                                   | `updateCheckoutQuery({ step })` — shallow, not `router.replace`                                      |
| Change `?checkout=` id (orphaned recovery)             | `router.replace` with new checkout id                                                                |
| After successful payment                               | `navigateToOrderConfirmation()` — `window.location.replace` to `/checkout/complete`                  |

### URL params

| Param                                     | RSC reads?       | Purpose                                                        |
| ----------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `checkout`                                | Yes              | Saleor checkout global id (required for active flow)           |
| `order` on `/checkout`                    | Yes → redirect   | Legacy; canonical confirmation is `/checkout/complete?order=`  |
| `step`                                    | No (client only) | `contact`, `shipping`, `payment` — shallow history             |
| `processingPayment`, Stripe return params | Client           | 3DS return; preserved by merging live `window.location.search` |

### Hooks (v2)

| Hook                            | Reads from                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `useCheckout()`                 | `CheckoutDataProvider` + session id (compat API; `refetch` → `refreshCheckout`) |
| `useCheckoutData()`             | Full context including `loadState`, `setCheckout`                               |
| `useLiveCheckoutSearchParams()` | Live URL including shallow step updates                                         |
| `useCheckoutTransition()`       | `"completing"` during payment → order navigation                                |
| `useRefreshCheckoutRsc()`       | Triggers `router.refresh()` for RSC `initialCheckout` / `me`                    |

### Session states (`resolveSessionUser`)

| Status          | UI meaning                                                         |
| --------------- | ------------------------------------------------------------------ |
| `guest`         | No valid session — show sign-in                                    |
| `authenticated` | `me` present                                                       |
| `unavailable`   | Transient failure — do not flash login; optional retry server-side |

Expired JWT maps to **`guest`** via `isDefinitiveAuthFailure` (structured Saleor error codes first, message fallback).

---

### 3.3 Payment Gateways

How to integrate Saleor payment apps in the Paper checkout. Covers the registry architecture, the two payment submit patterns, shared Saleor transaction primitives, and a checklist for wiring a new gateway (e.g. Adyen).

> **Related**: `checkout-management` (checkout lifecycle, **payment completion / transition UX**, debugging failed transactions) · Saleor transaction API in `saleor-storefront` skill

---

## Architecture

Saleor exposes payment apps on `checkout.availablePaymentGateways`. The storefront picks **one** integrated app via `INTEGRATED_GATEWAYS` (priority order), renders its UI, and drives Saleor's transaction mutations.

```
checkout.availablePaymentGateways
        │
        ▼
resolvePaymentProvider()          ← INTEGRATED_GATEWAYS registry (priority)
        │
        ├── submitMode: "server"  → useCheckoutPayment().submit → executePayment()
        └── submitMode: "client"  → provider UI owns Pay button (Stripe pattern)
        │
        ▼
Shared server actions (src/app/(checkout)/actions.ts)
  • paymentGatewayInitialize
  • transactionInitialize
  • transactionProcess
  • checkoutComplete
        │
        ▼
finalizeCheckoutOrder() / navigateToOrderConfirmation()
```

### Key files

| File                                                        | Purpose                                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/checkout/lib/payment/integrated-gateways.ts`           | **Registry** — priority, env flags, supported-gateway detection         |
| `src/checkout/lib/payment/resolve-provider.ts`              | Picks provider + `submitMode`                                           |
| `src/checkout/lib/payment/execute-payment.ts`               | Server-submit flow only (`submitMode: "server"`)                        |
| `src/checkout/lib/payment/providers/*.ts`                   | Per-app helpers (gateway ID, config parsing, errors)                    |
| `src/checkout/components/payment/integrated-payment-ui.tsx` | **UI registry** — maps provider type → component                        |
| `src/checkout/views/saleor-checkout/payment-step.tsx`       | Layout; uses `usesClientPaymentSubmit()` not provider-specific branches |
| `src/app/(checkout)/actions.ts`                             | Saleor mutations + optional server guards                               |
| `src/checkout/graphql/payment.graphql`                      | Transaction mutations                                                   |

---

## Two submit patterns

Pick the pattern that matches how the Saleor payment app expects to be driven.

| Pattern           | `submitMode` | Current example | Who clicks Pay?                | Typical flow                                                                                               |
| ----------------- | ------------ | --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Server-submit** | `"server"`   | Dummy Payment   | Payment step form / sticky bar | `transactionInitialize` → `checkoutComplete`                                                               |
| **Client-submit** | `"client"`   | Stripe          | Provider component's button    | `paymentGatewayInitialize` → `transactionInitialize` → PSP SDK → `transactionProcess` → `checkoutComplete` |

**Shared by both patterns** (reuse — do not reimplement):

- `updateCheckoutBilling()` before charging
- Live total validation (`getCheckoutPayAmount`, `hasMaterialCheckoutTotalChange`)
- `initializeCheckoutTransaction` / `processCheckoutTransaction` server actions
- `finalizeCheckoutOrder()` + `markPaymentCompleting()` session storage
- Zero-amount orders: `completeCheckoutOrder()` without a transaction

### Server-submit template

See `src/checkout/lib/payment/providers/dummy-pay.ts` + `executePayment()` switch case.

### Client-submit template

See `src/checkout/components/payment/stripe/` — especially `stripe-payment-form.tsx` for the full initialize → confirm → process → complete sequence.

`payment-step.tsx` automatically uses client-submit layout when `usesClientPaymentSubmit(provider)` is true (no outer `<form>`, billing above payment UI, no shared Pay button).

---

## Adding a new gateway

Example: wiring **Adyen** after Stripe and Dummy are already integrated.

### 1. Provider module

Create `src/checkout/lib/payment/providers/adyen.ts`:

- Export gateway ID constant (match Saleor app manifest ID exactly)
- `isAdyenGateway(gatewayId)` / `findAdyenGateway(gateways)`
- `isAdyenPaymentEnabled()` — env flag (mirror Stripe: `NEXT_PUBLIC_ENABLE_ADYEN_PAYMENTS`)
- `getAdyenPaymentGuardError(gatewayId)` — block `transactionInitialize` when flag is off
- Parse `paymentGatewayInitialize` / `transactionInitialize` / `transactionProcess` `data` payloads
- User-facing error helpers for failed transaction events

### 2. Registry entry

Add to `INTEGRATED_GATEWAYS` in `integrated-gateways.ts` **at the desired priority** (first match wins):

```typescript
{
  type: "adyen",
  submitMode: "client", // or "server" for simple apps
  findGateway: (gateways) => findAdyenGateway(gateways),
  isEnabled: isAdyenPaymentEnabled,
  matchesGateway: (gateway) => isAdyenGateway(gateway.id),
},
```

### 3. Types

Extend in `src/checkout/lib/payment/types.ts`:

- Add `"adyen"` to the integrated provider union (alongside `"stripe"` | `"dummy"`)
- Update `isIntegratedPaymentProvider()` if needed

Extend `IntegratedGatewayType` in `integrated-gateways.ts`.

### 4. Server-submit only: `execute-payment.ts`

If `submitMode: "server"`, add a case that calls `executeAdyenPayment()` (same shape as `dummy-pay.ts`).

If `submitMode: "client"`, add a case that returns a clear error — same as Stripe today — so nobody accidentally routes client flows through the form submit handler.

### 5. UI component

Create `src/checkout/components/payment/adyen/` (Drop-in, redirect handler, return URL builder, etc.).

Register in `integrated-payment-ui.tsx`:

```typescript
case "adyen":
  return <AdyenPayment checkout={checkout} gatewayName={provider.gateway.name} ... />;
```

### 6. Server action guard (recommended)

In `initializeCheckoutTransaction()` inside `src/app/(checkout)/actions.ts`:

```typescript
const adyenGuardError = getAdyenPaymentGuardError(variables.paymentGateway?.id);
if (adyenGuardError) return { ok: false, error: adyenGuardError };
```

Prevents bypassing disabled gateways via direct server action calls.

### 7. Tests

| File                                                 | What to test                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `providers/adyen.test.ts`                            | ID matching, env flag, config/error parsing                    |
| `resolve-provider.test.ts`                           | Priority vs other gateways, `submitMode` on resolved provider  |
| `integrated-gateways` via `payment-gateways.test.ts` | `hasUnsupportedPaymentGateway` when Adyen present but disabled |
| `execute-payment.test.ts`                            | Server-submit path only (if applicable)                        |

Run: `pnpm exec vitest run src/checkout/lib/payment`

### 8. Environment variables

Document in `.env.example` / deployment config:

```env
NEXT_PUBLIC_ENABLE_ADYEN_PAYMENTS=true
# Server-only mirror if needed:
ENABLE_ADYEN_PAYMENTS=true
```

Publishable keys and PSP config come from Saleor's `paymentGatewayInitialize` response — not from env (see Stripe).

### 9. Manual QA checklist

- [ ] Gateway appears on checkout when app is active in Saleor Dashboard
- [ ] `PaymentGatewayAlerts` hidden when integrated + enabled
- [ ] Billing address saved before charge
- [ ] Price change notice when total shifts after billing refresh
- [ ] Successful payment → order confirmation + checkout cookie cleared
- [ ] Failed payment → user sees error, can retry (fresh transaction)
- [ ] Zero-total checkout completes without PSP
- [ ] Redirect-return flows (if any) recover authorized transactions

---

## What you usually do **not** need to change

- `payment-step.tsx` layout — works for any `submitMode: "client"` gateway via `usesClientPaymentSubmit()`
- GraphQL mutations in `payment.graphql` — same for all Saleor payment apps
- `updateCheckoutBilling`, `checkout-pay-amount`, `finalizeCheckoutOrder`
- Cart / checkout cookie logic (`src/lib/checkout.ts`)

Only touch `payment-step.tsx` for **provider-specific** extras (e.g. Stripe's `AuthorizedPaymentRecovery`).

---

## Current integrated gateways

| App           | Gateway ID                                     | Env flag                             | Submit mode |
| ------------- | ---------------------------------------------- | ------------------------------------ | ----------- |
| Stripe        | `saleor.app.payment.stripe`                    | `NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS` | `client`    |
| Dummy Payment | `saleor.io.dummy-payment-app` (and legacy IDs) | `ALLOW_DUMMY_PAYMENT` / dev only     | `server`    |

Gift card gateway (`saleor.io.gift-card-payment-gateway`) is **ignorable** — it does not block resolution.

---

## Anti-patterns

❌ **Don't add a mock card form fallback** for unsupported gateways — `PaymentGatewayAlerts` explains the problem  
❌ **Don't route client-submit PSPs through `useCheckoutPayment().submit`** — they need their own Pay button and SDK lifecycle  
❌ **Don't hardcode `provider.type === "stripe"` in payment-step** — use `usesClientPaymentSubmit()`  
❌ **Don't skip server guards** for env-gated test gateways (Dummy pattern)  
❌ **Don't cache checkout totals at payment time** — always refresh before `transactionInitialize`  
❌ **Don't build a generic PSP abstraction interface** — each app has different SDK steps; reuse Saleor actions + per-provider modules instead

---

### 3.4 Checkout Components

Reusable checkout UI components for contact, address, and payment flows. Composing these components in checkout steps keeps the flow consistent and maintainable.

---

## Component Locations

```
src/checkout/components/
├── contact/              # Authentication & user display
├── shipping-address/     # Address selection & display
├── payment/              # Payment method & billing
└── address-form/         # Form utilities (existing)
```

## Contact Components

```tsx
import {
	SignInForm, // Email + password + forgot password
	SignedInUser, // Logged-in user display with sign out
	ResetPasswordForm, // New password form (reset callback)
	GuestContact, // Email input + create account checkbox
} from "@/checkout/components/contact";
```

| Component           | Props                                                          | Use Case                     |
| ------------------- | -------------------------------------------------------------- | ---------------------------- |
| `SignInForm`        | `initialEmail?`, `channelSlug`, `onSuccess`, `onGuestCheckout` | BFF sign-in (`loginWithBff`) |
| `SignedInUser`      | `user`, `onSignOut`                                            | Show logged-in user info     |
| `ResetPasswordForm` | `onSuccess`, `onBackToSignIn`                                  | Password reset callback      |
| `GuestContact`      | `email`, `onEmailChange`, `emailError?`, `onSignInClick`       | Guest email entry            |

## Address Components

```tsx
import {
	AddressSelector, // Radio list for saved addresses
	AddressDisplay, // Read-only address card
} from "@/checkout/components/shipping-address";

// Also re-exported from AddressFormFields:
import { AddressFields, FormInput, FormSelect, FieldError } from "@/checkout/components/shipping-address";
```

| Component         | Props                                                                             | Use Case                     |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------- |
| `AddressSelector` | `addresses`, `selectedAddressId`, `onSelectAddress`, `defaultAddressId?`, `name?` | Pick from saved addresses    |
| `AddressDisplay`  | `address`, `title?`, `onEdit?`                                                    | Show address read-only       |
| `AddressFields`   | `orderedFields`, `formData`, `errors`, `onFieldChange`, etc.                      | Dynamic country-aware fields |

## Payment Components

Integrated Saleor payment apps render via `IntegratedPaymentUi` (see `checkout-payment-gateways` rule). Steps compose billing + provider UI — there is no generic card-form fallback.

```tsx
import {
	PaymentMethodArea, // Resolves provider → IntegratedPaymentUi
	IntegratedPaymentUi,
	PaymentGatewayAlerts,
	BillingAddressSection,
	type BillingAddressData,
} from "@/checkout/components/payment";
```

| Component               | Props                                                                                                 | Use Case                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `PaymentMethodArea`     | `provider`, `checkout`, `billing`, error/notice callbacks                                             | Payment step wrapper                           |
| `IntegratedPaymentUi`   | Same — maps `provider.type` to Stripe, Dummy, or future gateway components                            | Add new gateway UI in one switch               |
| `PaymentGatewayAlerts`  | `gateways`                                                                                            | Warn when no / unsupported gateway on checkout |
| `BillingAddressSection` | `billingAddress?`, `shippingAddress?`, `userAddresses?`, `isShippingRequired?`, `errors?`, `onChange` | Billing with same-as-shipping                  |

## Usage Pattern

Steps import and compose these components:

```tsx
// In InformationStep.tsx
import { SignInForm, SignedInUser, GuestContact } from "@/checkout/components/contact";
import { AddressSelector } from "@/checkout/components/shipping-address";

// Orchestrate based on auth state
{
	authenticated ? (
		<SignedInUser user={user} onSignOut={handleSignOut} />
	) : contactSection === "signIn" ? (
		<SignInForm onSuccess={handleSignInSuccess} />
	) : (
		<GuestContact email={email} onEmailChange={setEmail} />
	);
}
```

## When to Create New Components

Extract into `components/` when:

- Used in **2+ places**
- **Self-contained** with clear props interface
- **100+ lines** that can be isolated

Keep inline when:

- **One-off** UI specific to that step
- Tightly coupled to step's state machine

---

## 4. UI & Channels

**Impact: MEDIUM**

UI components and channel configuration control the visual layer and multi-currency support.

### 4.1 UI Components

Create and style UI components with design tokens and shadcn/ui primitives.

> **Source**: [shadcn/ui](https://ui.shadcn.com/) - Component patterns and primitives used in this project

## Component Location

| Type                       | Location                  |
| -------------------------- | ------------------------- |
| Shared components          | `src/ui/components/`      |
| Product page components    | `src/ui/components/pdp/`  |
| Product listing components | `src/ui/components/plp/`  |
| Base primitives            | `src/ui/components/ui/`   |
| Navigation                 | `src/ui/components/nav/`  |
| Cart                       | `src/ui/components/cart/` |

## Design Tokens

**Single source of truth:** `src/styles/brand.css`. See `src/styles/README.md` for the full workflow.

Use semantic Tailwind classes (mapped in `tailwind.config.cjs`):

```tsx
// Resolves to brand.css via tailwind.config.cjs
<div className="bg-background text-foreground border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// Inverse footer (bg-foreground)
<p className="text-inverse-subtle">
```

Available tokens:

- `background`, `foreground` - Main bg/text
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary elements
- `muted`, `muted-foreground` - Subdued elements
- `inverse`, `inverse-subtle`, `inverse-muted` - Text on inverse surfaces (`bg-foreground`)
- `border`, `border-inverse` - Borders
- `destructive` - Error/danger states

## Using shadcn/ui Primitives

Import from `@/ui/components/ui/`:

```tsx
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/components/ui/dropdown-menu";
```

## Export Pattern

If component is in a subdirectory, export from index:

```typescript
// src/ui/components/pdp/index.ts
export { NewComponent } from "./NewComponent";
```

## Examples

### Basic Component

```tsx
import { cn } from "@/lib/utils";

interface CardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export function Card({ title, children, className }: CardProps) {
	return (
		<div className={cn("rounded-lg border border-border bg-card p-4", className)}>
			<h3 className="font-medium text-foreground">{title}</h3>
			<div className="mt-2 text-muted-foreground">{children}</div>
		</div>
	);
}
```

## Anti-patterns

❌ **Don't hardcode brand colors** (hex/rgb in components) when a token exists — edit `brand.css` instead  
❌ **Don't add `"use client"` unless needed** - Prefer Server Components  
❌ **Don't create new primitives** - Use existing shadcn/ui components  
❌ **Don't use inline styles** for brand colors - Use Tailwind classes backed by tokens

---

### 4.2 Channels & Multi-Currency

Configure multi-channel and multi-currency support. This storefront supports multiple Saleor channels, each with its own currency. Understanding the underlying fulfillment model helps debug "product not purchasable" issues.

> **Source**: [Saleor Docs - Stock Overview](https://docs.saleor.io/developer/stock/overview) - Fulfillment triangle and stock allocation

## How Channels Work

```
URL: /uk/products/...  →  Channel "uk" (GBP)
URL: /us/products/...  →  Channel "us" (USD)
```

- Currency comes from the channel settings in Saleor
- Channel selector appears in the footer (shows currency codes)
- Checkout inherits the channel from where the cart was created

## Saleor Commerce Model

Channels don't exist in isolation. Product purchasability depends on three connected entities:

```
        CHANNEL                 SHIPPING ZONE              WAREHOUSE
     (sales storefront)       (delivery region)         (inventory location)
            │                        │                        │
            ├────── assigned to ─────┤                        │
            │                        ├──── fulfills from ─────┤
            ├──────────── assigned to ────────────────────────┤
```

**All three connections must exist for a product to be purchasable.**

### Purchasability Checklist

When debugging why a product can't be purchased in a channel, verify all 7 conditions:

1. Product is **published** in the channel
2. Product is **available for purchase** in the channel
3. At least one variant has a **price** in the channel
4. Channel has at least one active **shipping zone**
5. That shipping zone has at least one **warehouse**
6. That warehouse has **stock** for the variant
7. That warehouse is also **assigned to the channel**

### Unreachable Stock

A warehouse assigned to a channel but **not** to any shipping zone for that channel results in "unreachable" stock -- it exists in the system but customers cannot buy it. This is the most common cause of confusing `isAvailable: false` on products that appear to have inventory.

### Why Products Differ Across Channels

The same product can be purchasable in one channel and not another because:

- **Different warehouses** are assigned to each channel
- **Different shipping zones** cover different countries per channel
- **Stock levels** vary per warehouse
- **Pricing** may only be set in certain channels

## Environment Setup

### Required for Channel Selector

The channel selector requires `SALEOR_APP_TOKEN` to fetch the channels list.

```env
# .env.local (keep secret, never commit)
SALEOR_APP_TOKEN=your-app-token
```

**Security:** This token is used server-side only. Keep it in `.env.local` for development and set it as a secret environment variable in production (e.g., Vercel environment variables).

**Without this token:** The channel list cannot be fetched. Channels would need to be hardcoded in `src/config/static-pages.ts` or the selector won't appear.

### Creating the App Token

The `channels` query requires an authenticated app token. No specific permission is needed just to list channels.

1. Open **Saleor Dashboard**
2. Go to **Extensions → Add extension → "Provide details manually"**
3. Fill in:
   - Name: `Storefront` (or any name)
   - Permissions: none required for channel listing
4. Save and copy the generated token
5. Add to `.env.local` as `SALEOR_APP_TOKEN`

## Storefront Channel Allowlist

Not every Saleor channel should become a storefront route. Use an explicit allowlist in production:

```env
# Recommended — only these channels get /{channel}/... routes
STOREFRONT_CHANNELS=us,uk

# Default channel (must be in allowlist when allowlist is set)
NEXT_PUBLIC_DEFAULT_CHANNEL=us

# Optional — discover additional channels from Saleor API at build time
# Requires SALEOR_APP_TOKEN; merged with allowlist, not a replacement
STOREFRONT_DISCOVER_CHANNELS=true
```

**Resolution order** (`src/lib/channel-slugs.ts` → `getStorefrontChannelSlugs()`):

1. `STOREFRONT_CHANNELS` — comma-separated allowlist (recommended)
2. If `STOREFRONT_DISCOVER_CHANNELS=true` — slugs from `getCachedChannelsList()` (`"use cache"`; required for PPR builds)
3. Fallback — `NEXT_PUBLIC_DEFAULT_CHANNEL` only

### Where the allowlist is enforced

| Location                          | Behavior                                                |
| --------------------------------- | ------------------------------------------------------- |
| `src/app/[channel]/layout.tsx`    | `generateStaticParams` + `notFound()` for unknown slugs |
| `src/app/api/revalidate/route.ts` | Path revalidation loops over allowed channels only      |
| `src/ui/components/footer.tsx`    | Channel selector lists allowed channels                 |

See `data-caching.md` for how webhooks use `getStorefrontChannelSlugs()` during invalidation.

## Architecture

### Storefront (channel in URL)

```
src/app/[channel]/          # All routes are channel-scoped
src/app/[channel]/(main)/   # Main store pages
```

Channel is read from URL params and passed to GraphQL queries.

### Checkout (channel from checkout object)

```
src/app/checkout/           # NOT under [channel]
```

Checkout gets channel from `checkout.channel.slug` (set when cart was created).

### Channel Selector

```
src/ui/components/channel-select.tsx  # The <select> component
src/ui/components/footer.tsx          # Where it's rendered
```

Requires `SALEOR_APP_TOKEN` to fetch channel list via `ChannelsListDocument` query.

## Key Files

| File                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `src/config/channels.ts`               | Allowlist env parsing + validation          |
| `src/lib/channel-slugs.ts`             | `getStorefrontChannelSlugs()` (React.cache) |
| `src/app/[channel]/layout.tsx`         | Route guard + `generateStaticParams`        |
| `src/ui/components/channel-select.tsx` | Channel switcher dropdown                   |
| `src/ui/components/footer.tsx`         | Renders channel selector                    |
| `src/graphql/ChannelsList.graphql`     | Query for fetching channels                 |
| `src/app/config.ts`                    | `DefaultChannelSlug` fallback               |

## Locale Considerations

Currently, number/date formatting uses a single locale (`localeConfig.default`), regardless of channel. For true per-channel locale:

```typescript
// Potential future enhancement
const channelLocales: Record<string, string> = {
	uk: "en-GB",
	us: "en-US",
	de: "de-DE",
};
```

This is NOT implemented - formatting is currently `en-US` for all channels.

## Anti-patterns

❌ **Don't expose every Saleor channel as a route** — Use `STOREFRONT_CHANNELS` allowlist in production  
❌ **Don't assume stock means purchasable** — Warehouse must be in both the channel AND a shipping zone for that channel
❌ **Don't debug availability client-side only** - Check the 7-point purchasability checklist in Saleor Dashboard first
❌ **Don't hardcode channel slugs without fallback** - Use `DefaultChannelSlug` from config

---

## 5. SEO

**Impact: MEDIUM**

Search engine optimization, structured data, and social sharing metadata help drive organic traffic and improve click-through rates.

### 5.1 SEO & Metadata

Add page metadata, JSON-LD structured data, and OG images.

> **Sources**:
>
> - [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) - Metadata API
> - [Schema.org Product](https://schema.org/Product) - JSON-LD structured data format

## Configuration

All SEO settings are in `src/lib/seo/config.ts`:

```typescript
export const seoConfig = {
	siteName: "Saleor Store",
	description: "...",
	twitterHandle: null, // Set to enable Twitter cards
	enableJsonLd: true,
	enableOpenGraph: true,
	enableTwitterCards: true,
	noIndexPaths: ["/checkout"], // Excluded from crawlers
};
```

## File Structure

```
src/lib/seo/
├── index.ts      # Public exports
├── config.ts     # Configuration
├── metadata.ts   # Page metadata helpers
└── json-ld.ts    # Structured data helpers
```

## Root Layout Metadata

```typescript
// src/app/layout.tsx
import { rootMetadata } from "@/lib/seo";
export const metadata = rootMetadata;
```

## Page Metadata

```typescript
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
	return buildPageMetadata({
		title: "Page Title",
		description: "Page description",
		image: "/og-image.jpg",
		url: "/page-path",
	});
}
```

## Product JSON-LD

```typescript
import { buildProductJsonLd } from "@/lib/seo";

const jsonLd = buildProductJsonLd({
  name: product.name,
  description: product.description,
  price: { amount: 29.99, currency: "USD" },
  inStock: true,
  images: [product.thumbnail?.url],
});

// In JSX:
{jsonLd && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
)}
```

## Dynamic OG Images

The `/api/og` route generates branded images:

```
/api/og?title=Product%20Name&price=€29.99
```

Use in metadata:

```typescript
buildPageMetadata({
	title: product.name,
	image: `/api/og?title=${encodeURIComponent(product.name)}`,
});
```

## Examples

### Complete Product Page SEO

```typescript
// src/app/[channel]/(main)/products/[slug]/page.tsx

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);

  return buildPageMetadata({
    title: product.name,
    description: product.seoDescription || product.description,
    image: product.thumbnail?.url,
    url: `/${params.channel}/products/${params.slug}`,
  });
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);

  const jsonLd = buildProductJsonLd({
    name: product.name,
    price: product.pricing?.priceRange?.start?.gross,
    inStock: product.isAvailable,
  });

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductContent product={product} />
    </>
  );
}
```

## Disabling SEO

To remove SEO features entirely:

1. Delete `src/lib/seo/` folder
2. Remove `rootMetadata` import from layout
3. Remove `buildPageMetadata`/`buildProductJsonLd` from pages
4. Delete `src/app/api/og/`

## Anti-patterns

❌ **Don't hardcode metadata** - Use the helpers  
❌ **Don't skip JSON-LD on product pages** - Important for search  
❌ **Don't forget `noIndexPaths`** - Exclude checkout, cart

---

## 6. Development

**Impact: MEDIUM**

Investigation skills help diagnose Saleor API behavior when documentation is unclear.

### 6.1 Saleor API Investigation

Investigate Saleor API behavior by checking source code when documentation is unclear or you need to understand exact data models.

## Step 1: Check the Generated Types (Schema)

The fastest way to confirm any type, field, enum, or input is the generated types file in this repo:

```bash
# src/gql/graphql.ts — full schema generated from your running Saleor instance
grep -A 20 "^export type Product " src/gql/graphql.ts
grep -A 10 "^export enum StockAvailability" src/gql/graphql.ts
grep -A 30 "^export type ProductFilterInput" src/gql/graphql.ts
```

This file contains the **full Saleor schema** as TypeScript types (all types, enums, inputs -- not just the ones used in declared queries). Generated by `pnpm generate` via API introspection, so it always matches your exact Saleor version.

If the types confirm what you need, stop here.

## Step 2: Check Saleor Source for Behavior

Types tell you _what_ fields exist. For _how_ they behave (permission checks, filtering logic, side effects), check the Saleor core source:

- [Saleor API Reference](https://docs.saleor.io/api-reference) - Online docs
- [Saleor Developer Docs](https://docs.saleor.io/developer) - Guides and concepts

If the Saleor core repo is available locally (e.g. `../saleor/`), or clone it:

```bash
cd /tmp && git clone --depth 1 https://github.com/saleor/saleor.git saleor-core
```

For directory structure and grep patterns, see [saleor-key-directories.md](../references/saleor-key-directories.md).

| Path                       | Purpose                     |
| -------------------------- | --------------------------- |
| `saleor/graphql/product/`  | Resolvers, permission logic |
| `saleor/product/models.py` | Django models               |

## Examples

### Example: Does `product.attributes` filter by `visibleInStorefront`?

**Investigation** in `saleor/graphql/product/resolvers.py`:

```python
def resolve_product_attributes(root, info, *, limit):
    if requestor_has_access_to_all_attributes(info.context):
        dataloader = AttributesByProductIdAndLimitLoader        # Admin: ALL
    else:
        dataloader = AttributesVisibleToCustomerByProductIdAndLimitLoader  # Customer: FILTERED
```

**Conclusion**: Yes, storefront users only see `visibleInStorefront=True` attributes. No client-side filtering needed.

### Example: Token-Based Data Filtering

Saleor filters data based on authentication:

| Token                      | `product.attributes` returns    |
| -------------------------- | ------------------------------- |
| None (anonymous)           | Only `visibleInStorefront=True` |
| Customer JWT               | Only `visibleInStorefront=True` |
| App with `MANAGE_PRODUCTS` | ALL attributes                  |

This applies to many "visible in storefront" flags across Saleor.

## Key Insights

### Storefront Auto-Filtering

When building storefront features, you typically don't need to:

- Fetch `visibleInStorefront` field
- Filter data client-side

The API already returns only what's meant to be shown based on your token.

### Product Types Control Variant Attributes

Which attributes appear on variants is configured at the **ProductType** level:

Dashboard → Configuration → Product Types → [Type] → Variant Attributes

If an attribute doesn't appear in `variant.attributes`, check the ProductType configuration.

## Anti-patterns

❌ **Don't guess API behavior** - Check the source  
❌ **Don't filter `visibleInStorefront` client-side** - API does it  
❌ **Don't assume attribute presence** - Check ProductType config

---

---

## Project-Specific Gotchas

### React Anti-patterns Seen in This Codebase

**State-to-state sync in effects:**

```tsx
// BAD - derived state in effect
useEffect(() => {
	setDerivedValue(computeFrom(sourceValue));
}, [sourceValue]);

// GOOD - compute inline or in the handler
const derivedValue = computeFrom(sourceValue);
```

**Child updating parent state via effect:**

```tsx
// BAD - child uses effect to update parent
useEffect(() => {
	onLayoutChange(true); // parent setState
}, []);

// GOOD - parent derives state from what it knows, or callback on user action
```

These patterns cause extra renders and make data flow hard to trace.

---

## References

1. [Saleor API Reference](https://docs.saleor.io/api-reference)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [React Documentation](https://react.dev)
4. [Agent Skills Specification](https://agentskills.io)
