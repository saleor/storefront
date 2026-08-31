# Migration: Cost invariants — private-state refresh, sharded listing tags, sampled telemetry

## Intent

Stop per-user activity from billing at site scale:

1. **Private state never invalidates shared cache.** Session/cart mutations use `refresh()` (`next/cache`) for the acting tab; cross-tab sync is client-side (localStorage version bump), not server revalidation. No Server Action fires on page load or tab focus.
2. **Listing invalidation is sharded per surface/slug** — one product edit busts only the grids it can appear in (all-products + its category + its collections), not every cached grid in the channel.
3. **One checkout fetch per request** — badge, drawer, and cart page share a request-memoized `Checkout.find`.
4. **Speed Insights sampled** via env (default 1%).
5. **Crawl and image-pipeline guards** — robots.txt blocks uncached faceted URLs; ESLint blocks new `next/image` imports.

Full rationale lives in the `paper-vercel-cost` rule (ported in step 7). Read it first if any step's "why" is unclear.

## Upstream reference

- **Commit:** `9cd9c5aa` on `cost-optimizations` — **update this to the merged SHA once the PR lands in main.**

## Prerequisites

- [`2026-06-cache-manifest-v3`](../2026-06-cache-manifest-v3/MIGRATION.md) — sharded tags extend `CACHE_PROFILES` / `applyCacheProfile`.
- [`2026-06-checkout-v2`](../2026-06-checkout-v2/MIGRATION.md) — step 1 edits `src/app/(checkout)/actions.ts` and `navigate-to-order.ts`; do not port onto a urql checkout.
- **Cached listing layer** (`src/lib/catalog/get-product-listing.ts`, upstream #1239): not yet a manifest migration. If the fork lacks this file, adopt the upstream version wholesale in step 2 — it already ships the sharded profiles — and wire PLP/category/collection pages through `isCacheableListingView`.
- Paths below assume locale routing (`(storefront)/[locale]/[channel]`); on older forks discover the `[channel]`-only equivalents.

## Out of scope

- Any styling. Header/badge/drawer markup stays the fork's own — only the sync/invalidation wiring changes.
- paper-app changes (webhook payload enrichment) — manual step, noted in step 3.

## Steps

### 1. Private-state refresh `[architecture]`

**Remove** every layout-wide invalidation triggered by per-user mutations:

- Delete `src/lib/auth/revalidate-storefront-chrome.ts` and `src/lib/auth/auth-surface-nav.ts` (and fork equivalents — search `revalidateStorefrontChrome`, `markAuthSurfaceHardNav`).
- In cart/auth/account/checkout server actions, drop `revalidatePath` fan-outs (`revalidateCart`, logout's per-locale `/login` purges, checkout-complete's browse-path purge). Mutating actions end with `refresh()` from `next/cache` instead; `logout()` needs none — callers hard-navigate.
- `deleteCartLine` / `updateCartLineQuantity` lose their `channel` parameter (it only fed revalidation). Update `cart-mutations.ts` types, cart page bindings, and the drawer.

**Add** cross-tab sync (copy new files from upstream):

- `src/lib/chrome-sync.ts` — `bumpChromeVersion()` writes a **unique token** (timestamp + random; a bare `Date.now()` collides within one ms, and an unchanged localStorage value fires no `storage` event → missed updates) and dispatches `CHROME_LOCAL_BUMP_EVENT` on `window` (storage events never fire in the writing tab).
- `src/ui/components/nav/components/user-menu/header-chrome-sync.tsx` — replaces `HeaderAuthRefresh`. Listens to `storage` + `visibilitychange` + `pageshow` (bfcache), refreshes only when visible **and** version changed; adopts own bumps via `CHROME_LOCAL_BUMP_EVENT` without refreshing. Mount it where `HeaderAuthRefresh` was (browse chrome slots).

**Bump call sites** — after every mutation another tab could care about: add-to-cart (`useFormStatus` pending falling edge), drawer mutations, delete-line button, logout hook, `syncAuthSurfacesAfterSignIn` (replaces the removed server action), `navigateToOrderConfirmation`.

The invariant going forward: **no Server Action on load, focus, or navigation; no `revalidatePath`/broad tags for per-user state.**

### 2. Sharded listing tags — manifest `[architecture]`

In `src/lib/cache-manifest.ts`:

- Replace the channel-wide `productListing` profile with three: `listingAll` (`listing:all:{channel}`), `listingCategory` (`listing:category:{channel}:{slug}`), `listingCollection` (`listing:collection:{channel}:{slug}`).
- Category/collection profiles get `sharedTagPattern` channel catch-alls (`listing:category-any:{channel}`, `listing:collection-any:{channel}`); `applyCacheProfile` attaches them alongside the slug tag; add `buildCatchAllTag`; full purge enumerates catch-alls per channel; `resolveCacheLifeProfileForTag` resolves them.
- Bump `MANIFEST_VERSION` (upstream: 7) and include `sharedTagPattern` in the manifest identity — paper-app reads this contract from `/api/cache-info`.
- Port the upstream `cache-manifest.test.ts` additions.

In `get-product-listing.ts`, apply the matching profile per fetch. **The tag slug must be the entity's primary slug** — callers resolve translated URL slugs through `getCategoryData`/`getCollectionData` first. A translated slug in the tag silently breaks webhook invalidation for that locale.

### 3. Sharded listing tags — webhook route `[architecture]`

In `src/app/api/revalidate/route.ts`:

- `parseWebhookPayload` additionally extracts `collectionSlugs` from `product.collections[].slug`. Semantics matter: `undefined` (payload doesn't say) → bust the channel's collection **catch-all**; `[]` (known in no collection) → bust nothing.
- `queueListingTags`: product events bust `listing:all` + the category slug tag (or category catch-all when the payload lacks the slug) + each collection slug tag (or collection catch-all). Category/collection entity events bust only their own grid.
- **paper-app requirement:** run a paper-app version that _forwards_ `product.collections` in the storefront POST (branch `cost-invariants` / its merge). Subscriptions already query `collections { id slug }`; older app versions strip the field before POSTing. After upgrading, **Sync Webhooks**. Without a forwarding app everything stays correct via catch-alls — just less precise.
- **Known gap (accepted, document it):** payloads name only _current_ memberships, so moving a product out of a category/collection leaves the old grid cached until the catalog cacheLife backstop. See the upstream `data-caching.md` "Known sharding gap" note.

### 4. Request-memoized checkout fetch `[architecture]`

Wrap `Checkout.find` in React `cache()` (`src/lib/checkout.ts`) so badge, drawer, and cart page share one Saleor round trip per request.

### 5. Speed Insights sampling `[architecture]`

Copy `src/lib/speed-insights.ts` (`speedInsightsSampleRate()`, env `NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE`, default `0.01`, validated 0–1). Pass `sampleRate={speedInsightsSampleRate()}` to **both** `<SpeedInsights />` mounts (storefront + checkout layouts). Document the env in `.env.example`.

### 6. Crawl and image guards `[architecture, adapt to fork]`

- `src/app/robots.ts` — disallow the fork's **actual** filter/sort/cursor query params (these render uncached) plus transactional surfaces (cart, checkout, orders, account, api). Adapt the upstream list; don't copy blind. Skip if the fork ships a custom robots route — merge instead.
- ESLint `no-restricted-imports` ban on `next/image` with a grandfathered allowlist — compute the fork's own: `rg -l 'from "next/image"' src`. New catalog imagery goes through `SaleorImage`.

### 7. Docs `[architecture]`

If the fork vendors the project skill: port `rules/paper-vercel-cost.md`, the rewritten "Keeping header chrome fresh" section of `data-auth-routes.md`, and the sharded-tag updates in `data-caching.md`; register in `SKILL.md`; run `pnpm run docs:compile`.

## Verify

[`verify.md`](verify.md)

## Record

`9cd9c5aa` (pre-merge — replace with merged SHA)
