# Data Caching

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

Invalidation: Saleor webhook → saleor-paper-app → POST /api/revalidate → revalidateTag + revalidatePath
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
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});
}
```

To change a TTL or tag pattern, edit `src/lib/cache-manifest.ts`. Both the actual caching behavior and the dashboard app's view of the cache update automatically.

### Tag Registry

| Tag Pattern                             | Profile ID           | Used By                                        | Invalidated When            |
| --------------------------------------- | -------------------- | ---------------------------------------------- | --------------------------- |
| `product:{slug}`                        | `products`           | PDP `getProductData()`                         | Product updated in Saleor   |
| `category:{slug}`                       | `categories`         | `getCategoryData()`                            | Category updated            |
| `collection:{slug}`                     | `collections`        | `getCollectionData()`, `getFeaturedProducts()` | Collection updated          |
| `page:{slug}`                           | `pages`              | `getPageData()` (CMS)                          | Page updated                |
| `navigation:{channel}`                  | `navigation`         | `getNavbarMenuItems()`                         | Navbar menu changed         |
| `footer-menu:{channel}`                 | `footerMenu`         | `getFooterMenuItems()`                         | Footer menu changed         |
| `storefront-content:{channel}:{locale}` | `storefront-content` | `getStorefrontContent()`                       | `storefront-*` Page updated |
| `channels`                              | `channels`           | `getCachedChannelsList()`                      | Channel list changed        |

**Named `cacheLife` tiers** (via `applyCacheProfile`, configured in `next.config.js`):

| Profile ID                  | Tier name  | Typical TTL | Used for                          |
| --------------------------- | ---------- | ----------- | --------------------------------- |
| `products`                  | `catalog`  | ~5 min      | Products, categories, collections |
| `pages`                     | `catalog`  | ~5 min      | CMS pages                         |
| `navigation` / `footerMenu` | `menus`    | ~1 hour     | Nav + footer menus                |
| `storefront-content`        | `menus`    | ~5 min      | Merchandising copy (Models)       |
| `channels`                  | `channels` | longer      | Channel metadata list             |

Do **not** add fetch-level `revalidate` on GraphQL calls inside `"use cache"` functions — `cacheLife` + webhooks handle freshness.

### Locale & Caching

Browse routes are `/{locale}/{channel}/…` (see `ui-locale-routing.md`, ADR 0001). Locale affects **what** is cached (translated GraphQL payloads), not **how fast** repeat visits are.

#### Cache keys vs cache tags

| Mechanism                                   | Includes locale?            | Role                                                                 |
| ------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| **`"use cache"` function arguments**        | ✅ Yes (`localeSlug` param) | Separate cache entry per locale — `/pl/…` and `/en/…` do not collide |
| **`cacheTag` (invalidation)**               | Usually ❌ for catalog      | One tag per slug/channel; webhook busts all locale variants together |
| **`storefront-content:{channel}:{locale}`** | ✅ Yes (BCP 47)             | Homepage/marketing copy from Saleor Models                           |

```typescript
// Separate cache entries — localeSlug is part of the Next.js cache key
getProductData("hoodie", "default-channel", "en"); // → English translation payload
getProductData("hoodie", "default-channel", "pl"); // → Polish translation payload

// Single invalidation tag — product update clears both entries
applyCacheProfile(CACHE_PROFILES.products, slug); // → tag: product:hoodie
```

**Performance:** After the first visitor per locale, that locale’s PDP/PLP is as fast as before locale routing. Adding `pl` and `de` creates ~N additional cache entries (one per locale × page), not extra work on every request.

**Cold start:** Each locale warms independently on first hit after deploy. English may be warm while Polish is still cold — normal, not a cross-locale penalty.

#### GraphQL `languageCode`

Cached fetches pass `graphqlLanguageCodeVariables(localeSlug)` so Saleor returns `translation { … }` fields for the browse locale. Map URL slugs to Saleor **base** language codes in `src/config/locale.ts` (e.g. `pl` → `PL`, not `PL_PL`) — Dashboard stores translations under `/translations/PL/…`.

Merge translated display fields with `withTranslatedProductFields()` / siblings in `src/lib/saleor-translations.ts` after the fetch.

#### Invalidation fan-out

Catalog tags stay slug-scoped (`product:{slug}`, `category:{slug}`, etc.) because Saleor webhooks do not signal “only PL changed.” On product/category/collection/page updates, `buildPathsForAllLocales()` revalidates every configured locale path:

```
/en/default-channel/products/hoodie
/pl/default-channel/products/hoodie
/de/default-channel/products/hoodie
```

Menus use channel-scoped tags (`navigation:{channel}`) while `localeSlug` remains in the cached function args — same pattern: per-locale cache entries, one tag clears all languages for that channel.

Storefront content uses explicit per-locale tags (`storefront-content:{channel}:{locale}`) via `buildStorefrontContentCacheTags()`.

#### Mental model

```
Request: /pl/default-channel/products/foo
         │
         ▼
   getProductData(slug, channel, "pl")     ← locale in cache key
         │
         ├─ HIT  → instant (same speed as pre-locale routing)
         └─ MISS → GraphQL languageCode: PL → cache ~5 min
                   tag: product:foo         ← shared; invalidates all locales
```

**Future refinement (optional):** Locale-scoped catalog tags (`product:{slug}:{locale}`) only if you get translation-only invalidation signals. Current design is simpler and correct for generic `PRODUCT_UPDATED` webhooks.

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
	const { slug, channel, locale } = await params;
	const product = await getProductData(slug, channel, locale); // "use cache"
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
// src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/loading.tsx

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
	const data = await getCachedData(params.slug, params.channel, params.locale);
	return <ProductList products={data} channel={params.channel} />;
}
```

All page routes in this project follow this pattern:

- `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx` (homepage)
- `src/app/(storefront)/[locale]/[channel]/(main)/pages/[slug]/page.tsx` (CMS pages)
- `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`
- `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx`
- `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`

### 6. Public vs Authenticated Queries

Two explicit GraphQL helpers:

- `executePublicGraphQL` - Safe inside `"use cache"` (no cookies needed)
- `executeAuthenticatedGraphQL` - NOT safe inside `"use cache"` (requires cookies)

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// ✅ Public data - safe inside "use cache"
async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
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

**Production path: [saleor-paper-app](https://github.com/saleor/saleor-paper-app)** (`../saleor-paper-app/` when developing both repos locally).

```
Saleor event → paper-app webhook handler → POST /api/revalidate → storefront cache purge
```

On install, the app registers managed webhooks (product, category, collection, promotion, page, menu) and proxies payloads to the storefront URL configured in app settings. Merchants get revalidation logs and manual purge in Dashboard; `REVALIDATE_SECRET` is shared between app and storefront.

| Event family                              | paper-app handler       | Storefront effect                                                                             |
| ----------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| `PRODUCT_*`, `CATEGORY_*`, `COLLECTION_*` | `product-changed`, etc. | Catalog tags + paths                                                                          |
| `PAGE_*`                                  | `page-changed`          | CMS `page:{slug}` **and** `storefront-content:{channel}:{locale}` when slug is `storefront-*` |
| `MENU_*`, `MENU_ITEM_*`                   | `menu-changed`          | `navigation:{channel}`, `footer-menu:{channel}`                                               |

**Do not** create parallel Saleor webhooks pointing directly at `/api/revalidate` when the Paper app is installed — duplicate deliveries cause redundant work and bypass app logging.

**Direct storefront webhooks** (Saleor Dashboard → `https://your-site.com/api/revalidate`) remain valid for self-hosted setups without the app. Subscribe to the same events and set `SALEOR_WEBHOOK_SECRET` on the storefront.

**What happens on webhook** (via `src/app/api/revalidate/route.ts`):

```typescript
// Product update — tag + paths for every locale × storefront channel
revalidateTag(`product:${slug}`, resolveRevalidateCacheLifeProfile("products"));
for (const path of buildPathsForAllLocales(CACHE_PROFILES.products, { channel, slug })) {
	revalidatePath(path); // e.g. /pl/default-channel/products/hoodie
}

// Menu update — channel-scoped tags (navbar vs footer mapped by menu slug)
revalidateTag(`navigation:${channel}`, resolveRevalidateCacheLifeProfile("navigation"));
revalidateTag(`footer-menu:${channel}`, resolveRevalidateCacheLifeProfile("footerMenu"));
```

Path revalidation uses `getStorefrontChannelSlugs()` and `buildPathsForAllLocales()` so multi-channel, multi-locale deployments invalidate every allowed URL. See `ui-channels.md` for allowlist configuration.

### Manual Invalidation

All manual invalidation requests use the `Authorization: Bearer` header (timing-safe comparison):

```bash
# Invalidate a specific product (both tag and path — use a concrete locale path)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/en/default-channel/products/blue-hoodie"

# Invalidate just the cached function data (all locale variants for that slug)
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

5. **Translation updated but still English on `/pl/…`?**

   - Confirm Saleor has a translation for base language `PL` (Dashboard: `/translations/PL/…`)
   - Bust cache: `curl -H "Authorization: Bearer …" "…/api/revalidate?tag=product:my-product"`
   - Restart dev server if you changed `src/config/locale.ts` GraphQL language mapping

6. **Check browser cache:**
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
❌ **Don't omit `localeSlug` from cached catalog/menu fetches** — All locales would share one cache entry and show the wrong language  
❌ **Don't use regional Saleor codes (`PL_PL`) in `graphqlLanguageCode`** — Dashboard translations use base codes (`PL`); see `src/config/locale.ts`  
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

| File                                                                         | What to Remove                           |
| ---------------------------------------------------------------------------- | ---------------------------------------- |
| `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`    | `getProductData()` cache directives      |
| `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`  | `getCategoryData()` cache directives     |
| `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx` | `getCollectionData()` cache directives   |
| `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`                    | `getFeaturedProducts()` cache directives |
| `src/ui/components/nav/components/nav-links.tsx`                             | Navigation cache directives              |

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

| File                                                                         | Purpose                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/lib/api-auth.ts`                                                        | Shared auth: timing-safe secret verification, Bearer token extraction |
| `src/lib/cache-manifest.ts`                                                  | Cache profile definitions (single source of truth)                    |
| `src/lib/graphql-locale.ts`                                                  | `languageCode` GraphQL variables from URL locale slug                 |
| `src/lib/saleor-translations.ts`                                             | Merge `translation { … }` fields after cached fetches                 |
| `src/config/locale.ts`                                                       | URL slug → BCP 47, GraphQL language code, `html lang`                 |
| `src/app/api/cache-info/route.ts`                                            | Cache introspection endpoint for dashboard app                        |
| `src/app/api/revalidate/route.ts`                                            | Webhook endpoint and manual revalidation                              |
| `src/lib/catalog/*.ts`                                                       | Catalog `"use cache"` fetches (featured, category, collection, page)  |
| `src/lib/menus/get-menu-data.ts`                                             | Navbar + footer menu cached fetches                                   |
| `src/lib/channels/get-channels-data.ts`                                      | Channel list cache                                                    |
| `src/lib/channel-slugs.ts`                                                   | Storefront channel allowlist resolution                               |
| `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`    | PDP with ProductShell + dynamic islands                               |
| `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`  | Category with "use cache"                                             |
| `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx` | Collection with "use cache"                                           |
| `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`                    | Homepage with "use cache"                                             |
| `src/ui/components/nav/components/nav-links.tsx`                             | Navigation with "use cache"                                           |
| `src/ui/components/footer.tsx`                                               | Footer menu + channels with "use cache"                               |
| `src/ui/components/pdp/variant-section-dynamic.tsx`                          | Dynamic variant section                                               |
| `src/ui/components/header.tsx`                                               | Header with Suspense boundaries                                       |
| `src/lib/checkout.ts`                                                        | Cart operations (always fresh)                                        |
| `next.config.js`                                                             | `cacheComponents: true`                                               |
