---
name: data-caching
description: Paper caching decisions: Cache Components (PPR), the static/hybrid page-boundary model (cached shell rendered directly; Suspense only for dynamic holes), cache-manifest.ts as source of truth, webhook revalidation, per-locale cache keys. Use when touching catalog data fetching, ISR, stale content, or revalidation.
---

# Data Caching

This rule holds **Paper's caching decisions** — what we cache, the contracts that keep it consistent, and how we invalidate. It is **not** a Next.js tutorial.

> **Next.js mechanics live in bundled docs — read them, don't restate them.**
>
> - `use cache`, `cacheLife`, `cacheTag`, PPR: `node_modules/next/dist/docs/` (version-matched).
> - PPR build/prerender errors (the “uncached data outside Suspense” family) come with an actionable **Stream / Cache / Block** fix menu in the dev overlay, terminal, and `next build`. The canonical fixes are at `nextjs.org/docs/messages/blocking-prerender-dynamic`.
>
> When the framework already explains a mechanic or emits a fix, link it — don't duplicate it here.

---

## The one decision: cached browse, live commerce

> **Display pages are cached for performance. Transactional flows are always real-time.**

| Surface                                | Data source                                                         | Freshness                              |
| -------------------------------------- | ------------------------------------------------------------------- | -------------------------------------- |
| PDP / category / collection / homepage | `getProductData()`, `getCategoryData()`, `getFeaturedProducts()`, … | Webhook-invalidated (1 hr backstop)    |
| Listing grids (unfiltered first page)  | `getProductListingPage()` and siblings                              | Webhook-invalidated (1 hr backstop)    |
| Filtered / paginated listing views     | inline `executePublicGraphQL`                                       | **Always fresh** (uncached long tail)  |
| Navigation / footer menus              | `getNavbarMenuItems()` / `getFooterMenuItems()`                     | Cached (~1 hr)                         |
| Cart drawer, checkout, add-to-cart     | `Checkout.find()`, server actions, Saleor mutations                 | **Always fresh** (`cache: "no-cache"`) |

**Why a stale PDP price is safe:** Saleor is the source of truth. Cart fetches fresh (`cache: "no-cache"`), `checkoutLinesAdd`/`checkoutComplete` recalculate server-side, and webhooks bust the cache on change. A shopper may see a stale price on the PDP but **cannot check out at it**.

Paper runs Next.js 16 with [`cacheComponents: true`](../../../next.config.js) (stable — not the Next 15 `experimental.ppr`/`dynamicIO` flags). **Nothing is cached by default**; catalog speed is opt-in via `"use cache"` at the data boundary (`src/lib/catalog/`, `src/lib/menus/`, `src/lib/channels/`, `src/lib/content/`). Paper does **not** use `"use cache: private"` — locale/channel are passed as function args instead.

---

## Cache manifest — single source of truth

All TTLs and tags are defined in **`src/lib/cache-manifest.ts`**. Cached functions read it via `applyCacheProfile()`; `/api/cache-info` serves it to the saleor-paper-app. Change a TTL or tag pattern in **one** place and both behavior and the Dashboard view update.

```typescript
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug); // sets cacheLife tier + cacheTag

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});
}
```

Always use `applyCacheProfile(CACHE_PROFILES.*, slugOrChannel)` — **never** raw `cacheLife("minutes")` or hand-rolled `cacheTag` strings that drift from the manifest. Do **not** add fetch-level `revalidate` inside `"use cache"` — `cacheLife` + webhooks own freshness.

### Tag registry

| Tag pattern                                                           | Profile                 | Used by                                                   | Invalidated when                                               |
| --------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `product:{slug}`                                                      | `products`              | `getProductData()`                                        | Product updated                                                |
| `category:{slug}`                                                     | `categories`            | `getCategoryData()`                                       | Category updated                                               |
| `collection:{slug}`                                                   | `collections`           | `getCollectionData()`, `getFeaturedProducts()`            | Collection updated                                             |
| `page:{slug}`                                                         | `pages`                 | `getPageData()` (CMS)                                     | Page updated                                                   |
| `products` / `categories` / `collections` / `pages`                   | same (sharedTag)        | Applied alongside each entity tag via `applyCacheProfile` | Full purge (`?all=1`), promotions                              |
| `listing:all:{channel}`                                               | `listingAll`            | `getProductListingPage()` (/products grid)                | Listing-affecting product event                                |
| `listing:category:{channel}:{slug}`                                   | `listingCategory`       | `getCategoryListingPage()`                                | Product event in that category; category event                 |
| `listing:collection:{channel}:{slug}`                                 | `listingCollection`     | `getCollectionListingPage()`                              | Enriched product event naming the collection; collection event |
| `listing:category-any:{channel}` / `listing:collection-any:{channel}` | same (sharedTagPattern) | Applied alongside each category/collection grid tag       | Fallback when the payload can't name the grid; full purge      |
| `navigation:{channel}`                                                | `navigation`            | `getNavbarMenuItems()`                                    | Navbar changed                                                 |
| `footer-menu:{channel}`                                               | `footerMenu`            | `getFooterMenuItems()`                                    | Footer changed                                                 |
| `storefront-content:{channel}:{locale}`                               | `storefront-content`    | `getStorefrontContent()`                                  | `storefront-*` Page updated                                    |
| `channels`                                                            | `channels`              | `getCachedChannelsList()`                                 | Channel list changed                                           |

Slug-scoped catalog entries carry **two** tags: the entity tag (`product:{slug}`) and the profile `sharedTag` (`products`). Entity webhooks bust the precise tag; `?all=1` revalidates shared tags so the whole catalog clears without enumerating slugs.
Named `cacheLife` tiers (configured in `next.config.js`): `catalog` (products/categories/collections/listings/CMS pages) is `stale 5 min / revalidate 1 hr / expire 1 day`, `menus` ~1 hr (nav/footer) and ~5 min (storefront-content), `channels` longer.

`revalidate` is a **backstop**, not the freshness mechanism — webhooks are. Regeneration is request-triggered: a cold entry costs nothing. A short backstop on a _hot_ entry can approach one regeneration per window (1,440/day at 60s); only shorten it if a deployment genuinely cannot run webhooks.

### Listing grids

Listing grids are cached only for the **unfiltered first page** (any sort order) — see `isCacheableListingView()` in `src/lib/catalog/get-product-listing.ts`. Filtered and paginated views fall through to a live fetch on purpose: every filter permutation would be a cache entry that is written once and rarely read again, trading invocation cost for cache-write cost. Category/collection slugs are cache-key arguments, so the entry upper bound is `(1 + categories + collections) × sorts × locales × channels` — only _visited_ grids materialize, and the **sharded tags** above keep invalidation per-grid: one product edit busts its own category/collection grids plus `listing:all`, never every grid in the channel. Product webhook payloads carry `category.slug`; collection membership comes from the saleor-paper-app **enriched payload** (`collections { slug }` in the subscription) — without it the channel catch-all keeps correctness at the cost of precision.

`GET /api/cache-info` returns the machine-readable manifest (Bearer `REVALIDATE_SECRET`, timing-safe) so the saleor-paper-app can build its invalidation UI dynamically. Manifest **v6+** includes an optional `identity` block (`saleorApiUrl`, `environment`, deploy metadata) for the Paper handshake. `saleorApiUrl` comes from `NEXT_PUBLIC_SALEOR_API_URL`. `environment` defaults from `VERCEL_ENV` / `NODE_ENV`; set `PAPER_STOREFRONT_ENVIRONMENT` only when those lie (true staging, or non-Vercel hosts that aren't prod).

---

## The page-boundary model (Paper convention)

The PPR layer stack — pick the page shape by **whether the route reads runtime data** (`searchParams`/`cookies`/uncached fetch): a **cached page** (no runtime data) uses a sync shell + page-level `Suspense` around an async body that awaits `params` + `"use cache"` (homepage — required for Partial Prefetching App Shell sharing); a **hybrid page** renders the cached shell **eagerly** and wraps **only** the dynamic island (`searchParams`/cookies) in `Suspense` (e.g. PLP grid, PDP variant section). A skeleton is a **per-hole** affordance, never a blanket page default — the homepage fold fallback is the App Shell exception. Documented in [`paper-architecture.md`](paper-architecture.md) and [`page-composition.md`](page-composition.md); PDP specifics in [`product-pdp.md`](product-pdp.md); auth routes in [`data-auth-routes.md`](data-auth-routes.md). The essentials here:

- **Catalog fetches live in modules**, not inline in pages long-term: `src/lib/catalog/`, `src/lib/menus/get-menu-data.ts`, `src/lib/channels/`.
- **`executePublicGraphQL`** is safe inside `"use cache"`; **`executeAuthenticatedGraphQL`** is **not** (needs cookies) — keep it out of cached functions.
- **Don't re-export server cached helpers from client-mixed barrels** (import catalog/menu modules directly; e.g. `ProductGalleryLcp` directly, not via a mixed `pdp/index.ts`).
- **CSS `order`** lets dynamic content appear above static `<h1>` while keeping the `h1` in the cached shell for SEO (PDP uses `order-1..4`).

### Browse chrome boundaries

The `(main)` layout is **sync**; each chrome region is an async **slot** in its own Suspense boundary. `<main>{children}</main>` is **never** wrapped in layout or chrome Suspense.

| Slot         | File                                              | Awaits                                                                     |
| ------------ | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Announcement | `browse-chrome-slots.tsx` → `AnnouncementBarSlot` | `params`, `getAnnouncementBarProps` (+ nested Suspense for dismiss cookie) |
| Header       | `HeaderSlot` → `Header`                           | `params`, menus + `getStorefrontContent`                                   |
| Footer       | `FooterSlot` → `Footer`                           | `params`, menus + `getStorefrontContent`                                   |
| Cart drawer  | `CartDrawerSlot`                                  | `params`, `getStorefrontContent`, checkout cookies                         |

Account routes use the **auth-gate** variant (sync layout → Suspense → async `AccountShell`, children inside the shell) — see `data-auth-routes.md`. Key files: `(main)/layout.tsx`, `main-chrome.tsx`, `browse-chrome-slots.tsx`.

### PPR pitfalls → let the framework guide the fix

When you hit an “uncached data accessed outside `<Suspense>`” error, the overlay/terminal gives you **Stream / Cache / Block** with per-rule docs. Paper's defaults for that choice:

| Situation                                                                   | Paper choice                                                                     |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Catalog display data (product, category, menus)                             | **Cache** — `"use cache"` + `applyCacheProfile`                                  |
| `searchParams`/cookies UI (variant gallery, cart badge, user menu)          | **Stream** — nested `<Suspense>` island                                          |
| Awaiting `searchParams`/`cookies()` in a page shell or inside `"use cache"` | Don't — it collapses the route into a dynamic hole; move the read into an island |

Never silence a PPR error by wrapping only `<main>{children}</main>` in Suspense (especially `fallback={null}`) — fix the segment that owns the dynamic work.

---

## Locale & caching

Browse routes are `/{locale}/{channel}/…` (see `ui-locale-routing.md`). Locale affects **what** is cached, not **how fast** repeat visits are.

| Mechanism                                  | Includes locale? | Role                                                                  |
| ------------------------------------------ | ---------------- | --------------------------------------------------------------------- |
| `"use cache"` function args (`localeSlug`) | ✅               | Separate cache entry per language — `/pl/…` and `/en/…` never collide |
| `cacheTag` (catalog)                       | ❌               | One tag per slug/channel; one webhook busts all locale variants       |
| `storefront-content:{channel}:{locale}`    | ✅ (BCP 47)      | Marketing copy from Saleor Models                                     |

```typescript
getProductData("hoodie", "default-channel", "en"); // English entry
getProductData("hoodie", "default-channel", "pl"); // Polish entry
applyCacheProfile(CACHE_PROFILES.products, slug); // single tag product:hoodie clears both
```

- Cached fetches pass `graphqlLanguageCodeVariables(localeSlug)`; map URL slugs to Saleor **base** codes in `src/config/locale.ts` (`pl` → `PL`, not `PL_PL`). Merge translations with `withTranslatedProductFields()` (`src/lib/saleor-translations.ts`) after the fetch.
- **Invalidation fan-out:** catalog tags stay slug-scoped and locale-agnostic — one `revalidateTag("product:hoodie")` clears every locale entry, so no path fan-out is needed.
- Adding locales adds ~N cache entries (one per locale × page), not per-request work. Each locale warms independently after deploy.

---

## Invalidation

**Production path: [saleor-paper-app](https://github.com/saleor/saleor-paper-app).** On install it registers managed webhooks and proxies them to the storefront:

```
Saleor event → saleor-paper-app → POST /api/revalidate → revalidateTag (+ revalidatePath for CMS pages)
```

**The `saleor-event` header drives the scope.** `src/lib/webhook-events.ts` maps each event Paper acts on to an entity and an `affectsListing` flag; anything absent from that map is logged and skipped. Opting a new event into invalidation means adding it there. Never reintroduce a catch-all fallback — an unmapped event (orders, checkouts, customers) firing a catalog purge is a self-inflicted cost and cache-hit-rate problem.

saleor-paper-app forwards that header on every entity POST. A POST without it (manual curl, older app) is treated as listing-affecting. After upgrading the app, click **Sync Webhooks** so Saleor delivers variant CRUD, stock, and metadata — stock events must arrive _with_ `saleor-event` or they bust the listing tags. Do not also subscribe the app to `PRODUCT_MEDIA_*`; Saleor already emits `PRODUCT_UPDATED` for media edits.

| Event family                                                        | Storefront effect                                                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `PRODUCT_*` / `PRODUCT_MEDIA_*` / variant created, updated, deleted | `product:{slug}` + `listing:all:{channel}` + its category grid + its collections' grids (enriched payload) or the collection catch-all |
| `PRODUCT_VARIANT_*` stock / metadata                                | `product:{slug}` only — never listing tags                                                                                             |
| `CATEGORY_*`, `COLLECTION_*`                                        | `category:{slug}` / `collection:{slug}` + only that entity's own listing grid                                                          |
| `PAGE_*`                                                            | `page:{slug}`, and `storefront-content:{channel}:{locale}` when slug is `storefront-*`                                                 |
| `MENU_*`, `MENU_ITEM_*`                                             | `navigation:{channel}`, `footer-menu:{channel}`                                                                                        |
| `CHANNEL_*`                                                         | `channels`                                                                                                                             |
| Everything else                                                     | Logged and skipped                                                                                                                     |

**Known sharding gap — removals.** Payloads name only a product's _current_ memberships, so moving a product out of a category/collection leaves the **old** grid's cache untouched: it keeps showing the product until the `catalog` cacheLife backstop expires it. Editing the source category/collection itself (a `CATEGORY_*`/`COLLECTION_*` event) busts its grid immediately. Accepted trade-off: a bounded staleness window on a rare operation, versus busting every grid in the channel on every product edit.

Catalog entries are **tag-addressable** — `applyCacheProfile` attaches the entity tag inside every `"use cache"` function, so `revalidateTag` alone busts every locale. Per-locale `revalidatePath` fan-out is therefore redundant for catalog data and is only used for CMS pages. `revalidateTag` takes the manifest profile (`resolveRevalidateCacheLifeProfile("products")`).

**Don't** point Saleor webhooks directly at `/api/revalidate` while the app is installed (duplicate deliveries, doubled invalidation cost). Each delivery logs its `saleor-event` and `saleor-api-url`, so duplicates show up as two identical log lines per change — check there first if invalidation looks twice as busy as expected. Direct webhooks remain valid for self-hosted setups without the app (set `SALEOR_WEBHOOK_SECRET`).

**Manual / emergency** (Bearer header, timing-safe; `?secret=` is deprecated):

```bash
# One product
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/en/default-channel/products/blue-hoodie"

# Full purge (path layout + shared/enumerable tags — what paper-app "Revalidate all" calls)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?all=1"
```

Without webhooks, TTL takes over (catalog 1 hr, menus 1 hr).

### Debugging stale content

1. Webhook configured + firing? (Dashboard → Webhooks → Deliveries; server logs for `[Revalidate]`).
2. Tag exact? (`product:blue-hoodie` — slug must match).
3. Force: `curl … "?tag=product:my-product"`.
4. Translation still wrong language on `/pl/…`? Confirm a `PL` base translation exists; bust the tag; restart dev if you changed `src/config/locale.ts`.

---

## Cost controls

Paper runs on Vercel, where the meters that matter are **function invocations + active CPU**, **edge middleware invocations**, **image transformations**, and **cache writes/bandwidth**. Caching decisions are cost decisions; these are the knobs, and each trades money against freshness. The full billing model, cost invariants, and scaling playbook live in [`paper-vercel-cost.md`](paper-vercel-cost.md).

| Knob                                                   | Default        | Raises cost when…                     | Trade-off when tightened                         |
| ------------------------------------------------------ | -------------- | ------------------------------------- | ------------------------------------------------ |
| `catalog.revalidate` (`cache-life-profiles.data.mjs`)  | 1 hr           | Lowered — request-triggered backstop  | Staler catalog if webhooks are not configured    |
| `isCacheableListingView()` allowlist                   | first page     | Widened — one entry per permutation   | Filtered views stay uncached (a live fetch each) |
| `NEXT_IMAGE_MIN_CACHE_TTL`                             | 31 days        | Lowered — re-optimizes the same image | In-place image replacements are served stale     |
| `images.deviceSizes` / `imageSizes` (`next.config.js`) | trimmed ladder | Widened — a transformation per width  | No >1920px variants for 4K displays              |
| `IMAGE_ALLOWED_HOSTS`                                  | unset          | Widened — third parties can bill you  | Non-Saleor image sources must be listed          |
| `SALEOR_MIN_REQUEST_DELAY_MS`                          | 0 at runtime   | Raised — billed idle CPU per request  | Less protection against Saleor API rate limits   |

Rules of thumb:

- **A cache entry is only worth writing if it will be read again before it expires.** That is the whole argument for the listing allowlist, and the test to apply before caching anything new.
- **Prefer webhook invalidation over short TTLs.** A TTL charges you continuously for freshness you need occasionally.
- **Narrow the invalidation scope, not the cache.** Busting less on each event beats caching less.

---

## Anti-patterns

❌ `cache: "no-cache"` on display pages — destroys performance
❌ Skipping webhook setup in production — users see stale prices
❌ `executeAuthenticatedGraphQL` (or `cookies()`/`searchParams`) inside `"use cache"` — needs runtime data
❌ Awaiting `searchParams` in a shell — collapses the route into a dynamic hole (move to an island)
❌ Raw `cacheLife("minutes")` / hand-rolled `cacheTag` — use `applyCacheProfile(CACHE_PROFILES.*)`
❌ Fetch-level `revalidate` inside `"use cache"` — `cacheLife` + webhooks own freshness
❌ A catch-all `default:` in the webhook switch — unmapped events must log and skip, not purge
❌ Busting listing tags on stock/metadata events — inventory sync would keep the grids permanently cold
❌ Caching every filter/cursor permutation — unbounded cache writes for entries nobody re-reads
❌ Shortening the `catalog` backstop to "make things fresher" — configure webhooks instead
❌ Wrapping only `<main>` in Suspense to silence a PPR error — fix the segment that owns the work
❌ Omitting `localeSlug` from cached fetches — all locales share one entry, wrong language
❌ Regional Saleor codes (`PL_PL`) in `graphqlLanguageCode` — Dashboard uses base codes (`PL`)
❌ Re-exporting server cached helpers from client-mixed barrels

---

## Key files

| File                                                                                              | Purpose                                               |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src/lib/cache-manifest.ts`                                                                       | Cache profiles — **single source of truth**           |
| `src/app/api/revalidate/route.ts`                                                                 | Webhook endpoint + manual revalidation                |
| `src/app/api/cache-info/route.ts`                                                                 | Manifest introspection for the Dashboard app          |
| `src/lib/catalog/*.ts`, `src/lib/menus/get-menu-data.ts`, `src/lib/channels/get-channels-data.ts` | `"use cache"` data boundaries                         |
| `src/lib/graphql-locale.ts`, `src/lib/saleor-translations.ts`, `src/config/locale.ts`             | Locale → GraphQL `languageCode` + translation merge   |
| `src/lib/channel-slugs.ts`                                                                        | Storefront channel allowlist for invalidation fan-out |

**Rolling back to plain ISR** (rarely needed): set `cacheComponents: false`, remove `"use cache"` + `applyCacheProfile` from the data modules above, and drop the profile argument from `revalidateTag` calls. Suspense boundaries, CSS-order layout, and the public/authenticated GraphQL split stay useful regardless.
