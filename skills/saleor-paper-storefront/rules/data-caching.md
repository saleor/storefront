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
| PDP / category / collection / homepage | `getProductData()`, `getCategoryData()`, `getFeaturedProducts()`, … | Cached (~5 min)                        |
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

| Tag pattern                             | Profile              | Used by                                        | Invalidated when            |
| --------------------------------------- | -------------------- | ---------------------------------------------- | --------------------------- |
| `product:{slug}`                        | `products`           | `getProductData()`                             | Product updated             |
| `category:{slug}`                       | `categories`         | `getCategoryData()`                            | Category updated            |
| `collection:{slug}`                     | `collections`        | `getCollectionData()`, `getFeaturedProducts()` | Collection updated          |
| `page:{slug}`                           | `pages`              | `getPageData()` (CMS)                          | Page updated                |
| `navigation:{channel}`                  | `navigation`         | `getNavbarMenuItems()`                         | Navbar changed              |
| `footer-menu:{channel}`                 | `footerMenu`         | `getFooterMenuItems()`                         | Footer changed              |
| `storefront-content:{channel}:{locale}` | `storefront-content` | `getStorefrontContent()`                       | `storefront-*` Page updated |
| `channels`                              | `channels`           | `getCachedChannelsList()`                      | Channel list changed        |

Named `cacheLife` tiers (configured in `next.config.js`): `catalog` ~5 min (products/categories/collections/CMS pages), `menus` ~1 hr (nav/footer) and ~5 min (storefront-content), `channels` longer.

`GET /api/cache-info` returns the machine-readable manifest (Bearer `REVALIDATE_SECRET`, timing-safe) so the saleor-paper-app can build its invalidation UI dynamically.

---

## The page-boundary model (Paper convention)

The PPR layer stack — pick the page shape by **whether the route reads runtime data** (`searchParams`/`cookies`/uncached fetch): a **static page** (no runtime data) is an `async` page that awaits `params` + `"use cache"` data and renders the shell **directly** (no page-level `Suspense`, no skeleton — e.g. homepage); a **hybrid page** renders the cached shell **eagerly** and wraps **only** the dynamic island (`searchParams`/cookies) in `Suspense` (e.g. PLP grid, PDP variant section). A skeleton is a **per-hole** affordance, never a **per-page** default. It is documented once in [`paper-architecture.md`](paper-architecture.md) and [`page-composition.md`](page-composition.md); PDP specifics are in [`product-pdp.md`](product-pdp.md); auth routes in [`data-auth-routes.md`](data-auth-routes.md). The essentials here:

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
- **Invalidation fan-out:** catalog tags stay slug-scoped; `buildPathsForAllLocales()` revalidates every configured locale path on a generic `PRODUCT_UPDATED`.
- Adding locales adds ~N cache entries (one per locale × page), not per-request work. Each locale warms independently after deploy.

---

## Invalidation

**Production path: [saleor-paper-app](https://github.com/saleor/saleor-paper-app).** On install it registers managed webhooks and proxies them to the storefront:

```
Saleor event → saleor-paper-app → POST /api/revalidate → revalidateTag + revalidatePath
```

| Event family                              | Storefront effect                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `PRODUCT_*`, `CATEGORY_*`, `COLLECTION_*` | Catalog tags + paths (all locales via `buildPathsForAllLocales`)                       |
| `PAGE_*`                                  | `page:{slug}`, and `storefront-content:{channel}:{locale}` when slug is `storefront-*` |
| `MENU_*`, `MENU_ITEM_*`                   | `navigation:{channel}`, `footer-menu:{channel}`                                        |

`revalidateTag` takes the manifest profile (`resolveRevalidateCacheLifeProfile("products")`); paths use `getStorefrontChannelSlugs()` × `buildPathsForAllLocales()`. **Don't** point Saleor webhooks directly at `/api/revalidate` while the app is installed (duplicate deliveries, no logging). Direct webhooks remain valid for self-hosted setups without the app (set `SALEOR_WEBHOOK_SECRET`).

**Manual / emergency** (Bearer header, timing-safe; `?secret=` is deprecated):

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/en/default-channel/products/blue-hoodie"
```

Without webhooks, TTL takes over (catalog ~5 min, menus ~1 hr).

### Debugging stale content

1. Webhook configured + firing? (Dashboard → Webhooks → Deliveries; server logs for `[Revalidate]`).
2. Tag exact? (`product:blue-hoodie` — slug must match).
3. Force: `curl … "?tag=product:my-product"`.
4. Translation still wrong language on `/pl/…`? Confirm a `PL` base translation exists; bust the tag; restart dev if you changed `src/config/locale.ts`.

---

## Anti-patterns

❌ `cache: "no-cache"` on display pages — destroys performance
❌ Skipping webhook setup in production — users see stale prices
❌ `executeAuthenticatedGraphQL` (or `cookies()`/`searchParams`) inside `"use cache"` — needs runtime data
❌ Awaiting `searchParams` in a shell — collapses the route into a dynamic hole (move to an island)
❌ Raw `cacheLife("minutes")` / hand-rolled `cacheTag` — use `applyCacheProfile(CACHE_PROFILES.*)`
❌ Fetch-level `revalidate` inside `"use cache"` — `cacheLife` + webhooks own freshness
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
