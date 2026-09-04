---
name: paper-vercel-cost
description: "Vercel billing model and Paper's cost invariants: why edge requests outnumber page views, what each storefront activity is billed as, why private state never invalidates shared cache, sharded listing tags, Speed Insights sampling, image pipeline guards, the scaling playbook, and high-churn / subpath / Cloudflare forks (PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT). Use when working on caching/invalidation cost, the Vercel bill, scaling traffic, or anything that changes how often functions run or caches regenerate."
---

# Vercel Cost Model & Optimization

Paper's mission includes running big e-commerce **cheaply**. On Vercel, caching decisions, invalidation scope, and client-side refresh behavior _are_ billing decisions. This rule holds the billing model, the invariants the codebase enforces, and the playbook for scaling further.

> Prices below are the shape of the bill, not gospel — verify current rates at
> [vercel.com/pricing](https://vercel.com/pricing) and the per-region tables
> (`iad1` is cheapest; EU/APAC delivery and compute cost more).

---

## The billing model

Pro plan: $20 platform fee (includes one seat), fixed allocations (~10M Edge Requests, ~1 TB Fast Data Transfer), a small shared usage credit, then metered overage:

```text
InfrastructureGross ≈
    EdgeRequests overage        (per 1M)
  + FastDataTransfer overage    (per GB — full compressed request AND response, headers included)
  + FunctionInvocations         (per 1M)
  + ActiveCPU                   (per hour — only while code executes)
  + ProvisionedMemory           (per GB-hour — while an instance has in-flight work,
                                 INCLUDING Saleor GraphQL waits; Fluid multiplexes
                                 concurrent requests onto one instance)
  + FastOriginTransfer          (per GB — traffic in/out of compute)
  + ISR reads (per 1M × 8 KB units) + ISR writes (per 1M × 8 KB units, ~10× pricier)
  + Image transformations (per 1K) + image cache reads/writes (8 KB units)
  + Build minutes

SpeedInsights = enabled × ($10 project + per-10K data points)
              — a hard visit emits ~3–6 points × sampleRate
```

### What each Paper activity is billed as

| Paper activity                                   | Meters hit                                                            |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| CDN-cached HTML/RSC hit                          | Edge Request + FDT only — **the cheap path; maximize this**           |
| Durable ISR read (after regional eviction)       | Edge + FDT + ISR read units                                           |
| Cold/stale cached page regeneration              | Invocation + CPU + memory + FOT + **ISR write units**                 |
| Dynamic hole (cart badge, user menu, PDP island) | Edge + invocation + CPU + memory + FOT + FDT                          |
| Server Action (cart mutation, login)             | Same as a dynamic request                                             |
| `/api/revalidate` webhook                        | Invocation now + **regeneration work later for every entry it busts** |
| `_next/static`, fonts, `public/`                 | Edge + FDT                                                            |
| `SaleorImage` `<img srcset>`                     | **$0 on Vercel** — bytes go straight to Saleor's CDN                  |
| `next/image` on a remote file                    | Edge + FDT; MISS/STALE adds a transformation + image cache writes     |
| Speed Insights point                             | Its own meter + the collection request                                |

### Why edge requests outnumber page views

That gap is the **shape of a Next.js App Router document**, not a broken page-view counter. Vercel **Edge Requests** count every hit on the edge network. **Page views** (Analytics / GA / Speed Insights) count one navigation — and usually only after JS runs, so bots and prefetch do not add a page view.

A typical Paper browse view, images already off Vercel:

| What the browser asks for                         | Count (order of)      | Vercel meter                                             |
| ------------------------------------------------- | --------------------- | -------------------------------------------------------- |
| HTML document                                     | 1                     | Edge + FDT; function only on MISS                        |
| JS chunks (`/_next/static`)                       | many                  | Edge + FDT only — **keep these HIT**                     |
| CSS                                               | a few                 | Edge + FDT                                               |
| Fonts (Geist ± mono ± editorial)                  | a few                 | Edge + FDT                                               |
| PPR / RSC holes (badge, drawer, grid, variant)    | several               | Edge; function if the hole is live                       |
| `prefetch={true}` or a unique App Shell per route | 0–N                   | Extra RSC; function if destination awaits `searchParams` |
| `/_next/image` (if the Saleor pipeline is off)    | one per card × srcset | Edge + **transformations**                               |
| Speed Insights / other beacons                    | 0–few                 | Own meter + Edge                                         |

A product grid through `next/image` can dominate the edge-request count by itself. With `SaleorImage`, the leftover requests are mostly **cheap CDN HITs**. Closing the gap to 1:1 is the wrong goal (that is a multi-page app with inlined CSS). The bill is the **expensive subset**: function invocations, image transforms, ISR writes, bot-driven uncached HTML.

**Bots inflate the gap further.** Analytics page views exclude most crawlers; Edge Requests do not. A sitemap of every unique SKU × that SKU’s asset graph is a large crawl with almost no page views.

Two multipliers dominate everything else at scale:

1. **Invalidation scope** — one `revalidatePath`/broad tag can convert millions of future cheap CDN hits into billed regenerations.
2. **Per-visit client behavior** — anything that runs per pageview/focus (a Server Action, a `router.refresh()`, an analytics beacon) multiplies by traffic.

---

## Invariants the codebase enforces

### 1. Private state never invalidates shared cache

Session and cart cookies are read inside **dynamic holes** (`HeaderActionsSlot`, `CartDrawerSlot`, cart page). That content is **never in the shared cache**, so there is nothing global to invalidate when one user's session or cart changes.

- Cart/auth server actions call **`refresh()` from `next/cache`** — re-renders _the acting user's_ route in the action response. See `src/app/actions.ts`, add-to-cart in `variant-section-dynamic.tsx`, account actions.
- Cross-tab sync is client-side: mutators call `bumpChromeVersion()` (`src/lib/chrome-sync.ts`, localStorage version); `HeaderChromeSync` refreshes a stale tab when it becomes visible. **No server round-trip on load or tab focus.**
- Auth boundaries (login redirect, logout, checkout exit) hard-navigate — a fresh document needs no invalidation.

❌ **Never** `revalidatePath(..., "layout")`, a path fan-out, or a broad `revalidateTag` from a per-user mutation. The removed `HeaderAuthRefresh`/`revalidateStorefrontChrome` design did this on **every hard load, tab refocus, and cart click**: a sitewide shared-cache purge per visitor — regeneration storms (invocations + ISR writes) and a defeated CDN, billed at traffic scale. `revalidatePath`/`revalidateTag` are for **shared catalog data changed at the source** (webhooks), nothing else.

### 2. Listing tags are sharded — invalidation is per-grid, not per-channel

Cache entries for listing grids are keyed by `(slug ×) sort × locale × channel` — upper bound `(1 + categories + collections) × sorts × locales × channels`, so tags follow the key (`cache-manifest.ts`):

| Tag                                                                   | Busted by                                                                                |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `listing:all:{channel}`                                               | listing-affecting product events (skip with `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT=0`) |
| `listing:category:{channel}:{slug}`                                   | product events (payload `category.slug`), category entity events                         |
| `listing:collection:{channel}:{slug}`                                 | enriched product events, collection entity events                                        |
| `listing:category-any:{channel}` / `listing:collection-any:{channel}` | fallback when the payload can't name the grid; full purge                                |

**Enriched payload contract:** saleor-paper-app queries `collections { slug }` (and `category { slug }`) in product/variant webhook subscriptions and — from its `cost-invariants` change on — forwards them in the storefront POST. `undefined` collections → channel catch-all (correct but imprecise); `[]` → no collection grid busted. Keep the app on a forwarding version (older ones strip the field) — precision here is directly billed regeneration avoided.

**Coalescing belongs in saleor-paper-app:** a bulk PIM sync of N products delivers N webhooks; the storefront intentionally does no dedup (multi-instance dedup drops invalidations). Buffer per (entity, channel) for 5–30 s in the app and deliver one enriched event. Duplicate app + direct webhook subscriptions double every invalidation — watch for repeated delivery fingerprints in `[Revalidate]` logs.

### 3. Per-user fetches are request-memoized, never shared-cached

`Checkout.find` is wrapped in React `cache()`: badge + drawer + cart page = **one** live Saleor fetch per render (was three — paid in Saleor load and provisioned-memory wall time). Keep it `no-cache`; checkout is per-user. Don't lazy-load the drawer to "save" cost: the badge needs the checkout anyway, and a fetch-on-open server action is an _extra_ billed invocation.

### 4. Speed Insights is sampled

`<SpeedInsights sampleRate={speedInsightsSampleRate()} />` in both root layouts — default **0.01** via `NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE`. Unsampled at millions of visits, Speed Insights can out-cost the entire storefront infrastructure (~3–6 points/visit, billed per 10K). 1% of big traffic is statistically plenty; set `1` only for short investigations, then set it back.

### 5. Images bypass Vercel; the guard is CI-enforced

Catalog imagery renders as plain `<img srcset>` against Saleor's CDN (`SaleorImage`, `ui-images` rule) — zero Vercel image billing. `eslint.config.mjs` bans new `next/image` imports outside `NEXT_IMAGE_ALLOWED_FILES`; adding a file there is a deliberate, reviewed cost decision. `NEXT_PUBLIC_PAPER_IMAGE_PIPELINE=vercel` is an emergency switch, not a mode. Video and heavy media never go in `public/` — a 20 MB video × 1M first views ≈ 20 TB FDT; use Mux/Cloudflare Stream/S3+CloudFront.

### 6. Crawlers don't get to run functions for free

`src/app/robots.ts` disallows faceted/paginated/sorted listing queries (each hit on those is an **uncached** invocation + live Saleor query, and the space is combinatorial) plus cart/checkout/account/search. Canonicals already point at clean URLs. Keep new dynamic surfaces out of crawl reach; rate-limit search/filter endpoints if bots ignore robots.

### 7. Existing discipline that must not regress

- Only the **unfiltered first page** of listings is cached (`isCacheableListingView`) — never cache filter/cursor permutations.
- Stock/metadata events **never** bust listing tags (`affectsListing`).
- No `prefetch={true}` on grids of links (per-card runtime prefetch = invocation fan-out); global `partialPrefetching` shares one App Shell per route.
- No `prefetch={true}` on persistent chrome **or homepage CTAs**. That full-resolves URL data (`params` / `searchParams`) on every view of the linking page — a per-visit invocation. `/products` and category grids await `searchParams`, so `prefetch={true}` from the header or hero is a listing render the shopper never asked for. Footer and secondary nav stay `prefetch={false}` so a fat unique-path menu does not fan out `_rsc` fetches on first paint.
- Catalog `cacheLife` backstop is 1 h `revalidate` / 1 d `expire` — webhooks own freshness. Never shorten the backstop to "feel fresher".
- No broad middleware; product pages render on demand; builds prerender locale × channel, never the catalog.

---

## Scaling playbook (in leverage order)

When traffic grows, apply these **before** considering leaving Vercel:

1. **Widen the anonymous static path.** Most visitors carry no cookies; their browse chrome and canonical PLP responses should be full CDN hits. Audit which holes really need cookies. The canonical (no-query) PLP still invokes a function because the page awaits `searchParams` — moving filtered views behind a client island + route handler would make the canonical response fully static. Measure the dynamic-request share first.
2. **Raise catalog backstops** toward 1 d `revalidate` / 1 w `expire` once webhook delivery is proven reliable (`cache-life-profiles.data.mjs`) — the backstop's only job is surviving a dropped webhook.
3. **Co-locate compute with Saleor.** Function region next to the Saleor API cuts GraphQL wait = provisioned-memory GB-hours (memory bills during I/O waits). Transatlantic hops cost more in memory-time and conversion than regional price deltas save.
4. **Test 2 GB vs 4 GB memory.** I/O-bound GraphQL rendering usually wins at the default 2 GB; CPU-heavy serialization may finish enough faster at 4 GB. Measure, don't guess.
5. **Retry budgets + circuit breakers on Saleor calls.** Retries during a Saleor incident multiply upstream load while holding instance memory open for responses that will fail anyway.
6. **Warm only the top-N routes** after deploy/purge (top categories, best-selling PDPs). Never warm the catalog — dormant SKUs are free precisely because nothing renders them.
7. **Cache admission for hot filters:** if analytics show a few filter combinations dominate, cache those on 2nd/3rd hit with a hard cardinality cap and aggressive expiry — don't widen `isCacheableListingView` wholesale.
8. **`assetPrefix` CDN offload:** serve `_next/static` (immutable JS/CSS) from an external CDN when FDT overage is material; RSC/ISR stay on Vercel.
9. **External CDN in front of Next** only with care: preserve RSC cache keys and remember Next's on-demand revalidation does **not** purge a foreign CDN — you own that purge path.
10. **Committed-use pricing** once optimized FDT/compute is predictable — negotiate before overage becomes routine.
11. **Self-hosting (OpenNext/containers) is the last lever, not the first.** An optimized Paper deployment is cheap; the ops cost of replacing Vercel's deploy/CDN/ISR machinery usually exceeds the platform margin until media, analytics, invalidation, and bots are already controlled. Revisit when the optimized bill's platform share still dominates.

### High-churn, subpath, and Cloudflare forks

Catalogs whose SKUs turn over constantly (unique items listed and sold all day) and a storefront mounted on a URL subpath under a marketing CMS change the cost model. Do these **before** raising TTLs or leaving Vercel:

1. **`PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT=0`.** Every sale is a listing-affecting product event. Leaving `listing:all` on means the all-products grid never stays warm. Category/collection shards still bust; `/products` then uses the 1 h `catalog` backstop. Accept a sold item lingering on that one grid until then — checkout cannot complete at a stale price.
2. **Do not ship a sitemap of every unique SKU.** Paper has no `sitemap.ts` for this reason. A dump invites crawlers to fetch every PDP × its asset graph; sold URLs 404 and get recrawled. Canonical + hreflang on visited pages is enough until you have a **chunked, in-stock-only** export.
3. **`basePath` (or a rewrite onto a subpath) is a first-class cost surface.** Middleware matchers, `robots.ts` paths, cookie `path`, checkout session-bridge URLs, and `assetPrefix` must all know the prefix. A 308 from the mount → `/{locale}/{channel}` is an extra edge request on every landing; for a single-market shop, collapsing locale/channel out of the path removes that hop.
4. **An extra CDN in front of Vercel does not cut the Vercel Edge Request count** unless that CDN **absorbs** the request (cache HIT on `/_next/static`, or a bot challenge that never reaches origin). Proxy-with-bypass = you pay both hops for the same asset graph. DNS-only the shop hostname, or cache only `/_next/static*` at the outer CDN with a long TTL and let HTML/RSC hit Vercel. Do not forward bot-management cookies in a way that varies Vercel's shared cache. Bot challenges belong **in front of** origin, not as a second trip after Vercel has already rendered.
5. **Co-locate Vercel region with Saleor.** Provisioned memory bills during GraphQL waits; a transatlantic hop is usually more expensive than a regional price delta saves.
6. **Search is always uncached** on Paper. Rate-limit it; never `prefetch` it; keep `/*/search` and `/*?*query=` in `robots.ts`. Adapt the disallow list to the fork's real filter params (and leftover query names from a previous storefront if those URLs still resolve).
7. **Images of unique, short-lived items must not touch `/_next/image`.** A sold SKU's transformation is paid once and never read again. Verify `SaleorImage` actually received a rung `srcset` — a missing alias silently falls back to the optimizer. Saleor's ladder is **product `thumbnail` and category/collection `backgroundImage` only**. Homepage banners, logos, and `/public` tiles have no rungs; do not expect uploading them as a Model `FILE` to create one. Pre-encode those and serve with a plain `<img>`, or accept a small, stable `next/image` set with honest `sizes`.
8. **Coalesce webhooks in saleor-paper-app** (5–30 s per entity). A bulk PIM/POS sync of N items is N storefront POSTs if the app does not buffer.

### Measure before believing any model

Replace assumptions with a 30-day export: Edge Requests + FDT by path, invocations/CPU/memory/wall time, FOT, ISR reads/writes, image transformations, Speed Insights points, build minutes, bot share, % of requests with checkout/auth cookies, Saleor GraphQL latency by operation, webhooks by event type. The most uncertain model inputs are Fluid concurrency, dynamic-request share, regional-CDN miss rate, and average response size — get those from real data.

For a **single homepage** (or any browse URL) when you cannot see the fork's source: capture one HAR after the bot challenge, then classify it.

1. Chrome Incognito → DevTools → Network → Disable cache.
2. Open the homepage. Wait until the spinner is idle, then ~3 s more (prefetch).
3. Right-click the request list → Save all as HAR with content.
4. `pnpm har:analyze path/to/page.har`

The script buckets HTML, `/_next/static`, RSC/prefetch, `/_next/image`, Saleor media, fonts, beacons, and bot-challenge scripts, and flags uncacheable HTML, redirects, and `Set-Cookie` on the document. `*.har` is gitignored (bodies often carry cookies). Drop the file in chat if you want it read here.

---

## Anti-patterns

❌ `revalidatePath`/layout fan-outs (or broad tags) for per-user state — use `refresh()` + `bumpChromeVersion()`
❌ Server Actions triggered by page load, tab focus, or navigation — per-visit actions bill at traffic scale
❌ Unsampled `<SpeedInsights />` (or mounting any per-pageview beacon without a sampling story)
❌ New `next/image` imports for catalog media — `SaleorImage`; extend `NEXT_IMAGE_ALLOWED_FILES` only deliberately
❌ Caching filter/cursor permutations, or one giant tag over many entries (write cost ↔ regeneration storms)
❌ Stock/metadata webhooks busting listing tags; unmapped events falling through to broad purges
❌ Video or heavy media in `public/`
❌ `prefetch={true}` on link grids, header chrome, homepage CTAs, or footer/utility links
❌ Crawlable dynamic query surfaces (facets, search) left out of `robots.ts`
❌ Retrying Saleor errors without a budget while an instance holds memory open
❌ Shortening cache backstops to compensate for missing webhooks

## Key files

| File                                               | Role                                                        |
| -------------------------------------------------- | ----------------------------------------------------------- |
| `src/lib/chrome-sync.ts`, `header-chrome-sync.tsx` | Cross-tab chrome sync without server work                   |
| `src/app/actions.ts`, `account/actions.ts`         | `refresh()`-based per-user mutations                        |
| `src/lib/cache-manifest.ts`                        | Sharded listing tags + catch-alls (manifest v7)             |
| `src/app/api/revalidate/route.ts`                  | Per-grid webhook invalidation, enriched payload contract    |
| `src/lib/checkout.ts`                              | Request-memoized `Checkout.find`                            |
| `src/lib/speed-insights.ts`                        | Sample-rate env parsing (default 0.01)                      |
| `src/app/robots.ts`                                | Crawl policy = cost policy                                  |
| `src/lib/webhook-events.ts`                        | Event allowlist + `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT` |
| `eslint.config.mjs`                                | `next/image` allowlist guard                                |
| `next.config.js`                                   | Image ladder/TTL/allowlist, cacheLife tiers                 |

Related: [`data-caching.md`](data-caching.md) (cache manifest, invalidation), [`ui-images.md`](ui-images.md) (image pipeline decision table), [`data-auth-routes.md`](data-auth-routes.md) (chrome freshness). Backlog: [`docs/plans/paper-cost-efficiency.md`](../../../../docs/plans/paper-cost-efficiency.md).
