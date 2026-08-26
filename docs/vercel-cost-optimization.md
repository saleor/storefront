# Cutting Vercel cost on a Saleor storefront

A migration checklist for anyone running a Next.js + Saleor storefront on Vercel. Every item
below shipped on Paper's `feat/better-cost-control` branch; file paths reference Paper, but the
reasoning applies to any fork.

Ordered by leverage. Items 1–4 are one-line config changes worth doing today. Item 5 is the
structural one. Items 6–11 are caching and compute.

## Why these specific things

These are the meters this guide is written against. Rates are **iad1 Pro on-demand** — the
cheapest published region, confirmed against Vercel's docs in August 2026. EU and APAC run
higher (transformations up to $0.0812 / 1K, cache writes up to $6.40 / 1M). Enterprise
contracts and the pre-2025 “source images” image plan can differ.

| Meter                           | Rate (iad1)                  | What drives it                                                 |
| ------------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Image transformations           | $0.05 / 1K                   | billed on cache MISS and STALE, per (source × width × quality) |
| Image cache writes              | $4.00 / 1M units (8 KB)      | same events, weighted by output bytes                          |
| ISR writes                      | $4.00 / 1M units (8 KB)      | every regeneration of a cached route                           |
| Fast Data Transfer              | $0.15 / GB over 1 TB         | every byte Vercel serves, including `/_next/image` responses   |
| Active CPU / Provisioned Memory | $0.128 / hr, $0.0106 / GB-hr | CPU while code runs; memory for the whole instance lifetime    |

Image cache reads, ISR reads, Edge Requests, and function invocations are real meters too.
They are usually smaller on this workload, so they stay off the table.

The trap on the first two: they scale with **distinct (source × width) pairs that get
requested at least once per TTL window** — a shopper, a crawler, or prerender. No request,
no transformation. A 20K-SKU catalog does not generate a bill by existing. What it does is
multiply how many of those pairs _can_ be hit, and a 4-hour TTL means a pair that is hit
even once a window can be re-derived ~180 times a month.

## Checklist

```
[ ]  1. minimumCacheTTL: 4h -> 31 days
[ ]  2. Every Saleor thumbnail/url selection passes size: and format: WEBP
[ ]  3. Trim deviceSizes / imageSizes, and formats: ["image/webp"]
[ ]  4. Replace remotePatterns "**" with an explicit host allowlist
[ ]  5. Serve catalog images from Saleor's CDN via <img srcset>, not /_next/image
[ ]  6. Scope webhook invalidation by the saleor-event header; never default-purge
[ ]  7. Raise the catalog revalidate backstop from 60s to 1h
[ ]  8. Cache the listing grids (PLP / category / collection)
[ ]  9. Disable the build-time GraphQL throttle at runtime
[ ] 10. Exclude /api, static assets, and other surfaces from the middleware matcher
[ ] 11. Stop prefetching every link
[ ] 12. Check for duplicate webhook subscriptions (Saleor app + direct)
[ ] 13. Audit every remaining next/image call site for Saleor-backed sources
```

---

## 1. Raise `minimumCacheTTL`

Next's default is 4 hours. A variant that is requested at least once per window can be
re-transformed up to **~180 times a month** (31 days × 24 h / 4 h) — each one a billed
transformation plus a billed cache write. Idle images cost nothing. Saleor thumbnail URLs
are stable per (media id, size, format), so there is no reason to re-derive a pair that
already exists.

```js
// next.config.js
images: {
  minimumCacheTTL: 2678400, // 31 days
}
```

Single highest-value line in this document. Vercel recommends it in their own cost guide.

## 2. Never select a bare `thumbnail { url }`

Without arguments, Saleor returns the **original upload** in its original format — frequently a
2–4 MB 4096px PNG. Vercel then downloads and transcodes that on every cache miss, and you pay for
the bytes twice.

```graphql
# Bad — original upload, original format
thumbnail { url }

# Good
thumbnail(size: 256, format: WEBP) { url }
```

Audit every `thumbnail` and `media { url }` selection in your `.graphql` files, including the ones
in checkout and order fragments that nobody looks at. Sizing category/collection `backgroundImage`
matters most — those are full-bleed heroes fed from the largest originals.

> **Saleor snaps to the nearest rung, not the next one up.** The ladder is
> `32, 64, 128, 256, 512, 1024, 2048, 4096`. Asking for `300` returns `256`. Only ever request
> values from that list, or the width you asked for is not the width you get.

## 3. Trim the width ladders

Every width in `deviceSizes` and `imageSizes` that a `sizes` attribute can select is a separately
billed transformation per source image. The defaults include 2048 and 3840, which only serve 4K
and retina-desktop, and which cost the most to produce and store.

```js
// next.config.js
images: {
  formats: ["image/webp"],           // AVIF cold-encodes add ~500ms+ to first hit, hurting LCP
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [64, 96, 128, 256, 384],
}
```

While you are here, check that each call site's `sizes` matches its actual layout. A half-width
panel declaring `100vw` requests double the pixels it displays, at every breakpoint.

## 4. Lock down `remotePatterns`

A wildcard host pattern turns your optimizer into an open image proxy that anyone can bill you for.

```js
const imageRemotePatterns = [
	{ protocol: "https", hostname: new URL(process.env.NEXT_PUBLIC_SALEOR_API_URL).hostname },
	...(process.env.IMAGE_ALLOWED_HOSTS?.split(",")
		.map((h) => h.trim())
		.filter(Boolean)
		.map((hostname) => ({ hostname })) ?? []),
];
```

Keep the env var **without** a `NEXT_PUBLIC_` prefix — it is read at build time and should never
be inlined into a client bundle.

## 5. Skip the optimizer for catalog images

Items 1–4 make the optimizer cheaper. This one removes it from the hot path.

Saleor already produces a correctly-sized, CloudFront-cached WebP for every rung you request.
Sending that through `/_next/image` pays for a transformation that re-derives a file you already
have. Request several rungs as aliased fields and build the `srcset` yourself:

```graphql
thumbnail(size: 1024, format: WEBP) { url alt }
thumbnail256: thumbnail(size: 256, format: WEBP) { url }
thumbnail512: thumbnail(size: 512, format: WEBP) { url }
```

```ts
export function buildSaleorSrcSet(entries: readonly { width: number; url?: string | null }[]) {
	const seen = new Set<number>();
	const candidates: string[] = [];
	for (const { width, url } of entries) {
		if (!url || seen.has(width)) continue;
		seen.add(width);
		candidates.push(`${url} ${width}w`);
	}
	// Fewer than two candidates tells the browser nothing that `src` doesn't.
	return candidates.length > 1 ? candidates.join(", ") : undefined;
}
```

Then render a plain `<img>` when a rung set exists, and fall back to `next/image` when it does not
(local assets, CMS uploads). Paper's version is `src/ui/atoms/saleor-image.tsx`.

Three consequences to handle, or this trades cost for a worse LCP:

- **Images become cross-origin.** Under `next/image` they rode the connection the document already
  opened. Add `<link rel="preconnect">` for the Saleor media origin in your root layout.
- **`priority` no longer implies a preload.** `next/image` emits one; a plain `<img>` does not.
  Call `preload(src, { as: "image", imageSrcSet, imageSizes, fetchPriority: "high" })` from
  `react-dom` for the LCP image.
- **New rungs 302-redirect on first request** while Saleor generates them, then serve directly
  forever after. Self-healing, but on a large catalog consider warming the new sizes before the
  cutover.

Gate it behind an env var so a fork can revert without a code change:

```ts
export const IMAGE_PIPELINE: "saleor" | "vercel" =
	process.env.NEXT_PUBLIC_IMAGE_PIPELINE === "vercel" ? "vercel" : "saleor";
```

**Trade-off:** three rungs per product instead of one is real thumbnail-generation load on Saleor.
You are moving cost off Vercel, not eliminating it — though Saleor generates each rung once and
serves it from CloudFront thereafter.

## 6. Scope webhook invalidation to the event that fired

The common bug is a `switch` whose `default` branch purges the product listing. Any unrecognised or
malformed delivery then invalidates every listing route in every locale, repeatedly.

Drive invalidation off Saleor's `saleor-event` header and treat the mapping as an allowlist —
anything absent is logged and skipped. Then split events by whether they can change a listing card:

```ts
// Changes a card: bust the listing tag.
product_created, product_updated, product_deleted,
product_media_created / _updated / _deleted,
product_variant_created / _updated / _deleted,
product_variant_discounted_price_updated

// Cannot change a card, and fires far more often: PDP tag only.
product_metadata_updated, product_variant_metadata_updated,
product_variant_out_of_stock, product_variant_back_in_stock,
product_variant_stock_updated, *_in_channel, *_for_click_and_collect
```

Inventory sync must not cost a listing cache entry. On a store with live stock feeds this is the
difference between a handful of listing regenerations a day and tens of thousands.

Event names are verifiable against `saleor/webhook/event_types.py` (`WebhookEventAsyncType`).

## 7. Raise the catalog revalidate backstop

If webhooks are wired up they are your freshness mechanism, and `revalidate` is only the safety net
for a webhook that was never configured or got dropped. Regeneration is request-triggered — a cold
entry costs nothing. A _hot_ entry with a 60-second backstop can approach 1,440 regenerations a
day; an hour caps that at 24.

```js
catalog: {
  stale: 5 * MINUTE,
  revalidate: 1 * HOUR,   // was 1 * MINUTE
  expire: 1 * DAY,
}
```

Worth understanding why this is not a small change: at a 60-second window and moderate per-entry
traffic, nearly every request finds the entry stale, so the cache does almost no work and you pay a
regeneration plus an ISR write for most requests.

## 8. Cache the listing grids

Check whether your PLP, category, and collection grids are cached at all — in many forks they are
not, so every request pays a full GraphQL round trip plus a full render. That cost scales linearly
with traffic.

The reason forks skip it is filter and pagination combinatorics. Cache an allowlist of views
instead: unfiltered, first page, sort-only. Those are the ones that get crawled and shared, and
they are a small bounded set. Everything else falls through to a live render.

One correctness note: have the cached function **throw** when the GraphQL call fails, rather than
returning `null`. Otherwise a transient upstream blip caches a 404 for the whole TTL. Reserve
`null` for genuinely absent entities.

## 9. Turn off the GraphQL throttle at runtime

Storefronts often carry an inter-request delay so `generateStaticParams` does not trip Saleor's
rate limiter during `next build`. At runtime the concurrency cap already bounds pressure, so the
delay only adds latency — and on Fluid Compute you pay for that wall time as Provisioned Memory,
which bills during I/O wait.

```ts
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

new RequestQueue(
	parseInt(process.env.SALEOR_MAX_CONCURRENT_REQUESTS || "3", 10),
	parseInt(process.env.SALEOR_MIN_REQUEST_DELAY_MS || (isBuildPhase ? "200" : "0"), 10),
);
```

## 10. Tighten the middleware matcher

Middleware that runs on API routes, static assets, and favicon requests burns Edge Request CPU
Duration for nothing.

```ts
export const config = {
	matcher: ["/((?!api/|api$|checkout/|checkout$|_next/|.*\\.[\\w]+$).*)"],
};
```

The trailing `.*\\.[\\w]+$` excludes anything with a file extension. Note that self-hosted and
`next start` deployments apply matchers differently, so keep any hard guards inside the middleware
body too.

## 11. Stop prefetching every link

`prefetch={true}` on a grid of category tiles fires one RSC request per tile on viewport entry —
edge requests, function invocations, and render time for pages most visitors never open. Leave
Next's default (prefetch on hover) except on the one or two links you know convert.

## 12. Check for duplicate webhook subscriptions

If you run direct Saleor webhooks **and** a storefront app that subscribes to the same events, both
deliver, and you pay for every invalidation twice. This is invisible in aggregate metrics.

Log a short fingerprint of each delivery body. The same fingerprint arriving twice within seconds
is a duplicate subscription, not two edits:

```ts
createHash("sha1").update(rawBody).digest("hex").slice(0, 12);
```

Do not use this to _drop_ deliveries — functions are multi-instance, so dedup here would be
unreliable in exactly the way that silently loses invalidations.

---

## Verifying it worked

Build, then list every source still reaching the optimizer:

```bash
pnpm build

grep -rhoE '<img[^>]*data-nimg[^>]*>' .next/server/app --include='*.html' \
  | grep -oE '/_next/image\?url=[^&"]+' \
  | sed 's|.*url=||' \
  | python3 -c 'import sys,urllib.parse as u;print("\n".join(sorted({u.unquote(l.strip()) for l in sys.stdin})))'
```

Filtering on `data-nimg` matters. A plain `grep` for `/_next/image` also matches the RSC flight
payload embedded in `<script>` tags, which inflates the count with entries that never become
requests. `data-nimg` is emitted only on elements `next/image` actually rendered.

Expect a short list, and read it carefully — **every line is a component still on the optimizer.**
On Paper's own build exactly one source survives: the homepage hero, which renders a raw CMS upload
rather than a `thumbnail()` field and so has no rung set to request.

Then compare a full billing cycle before and after on Image Optimization transformations, ISR
writes, Active CPU, and Fast Data Transfer. The one to watch in week one is transformations. If
the count does not collapse, something is still routing catalog images through the optimizer.

### The silent fallback trap

Item 5 only takes effect where a rung set actually reaches the component. Two patterns quietly keep
paying, and neither produces a warning. This is not hypothetical — the first pass of this work
converted the product grid and the PDP gallery and still left three sections on the optimizer:

- **A section prop typed as a bare URL string.** `image-with-text`, `editorial-hero`, and
  `category-tile-grid` all took `image?: string | null`, with nowhere to put a rung set. Saleor
  images routed through them stayed on the optimizer even while the same product rendered as a raw
  `<img srcset>` in the grid directly above. Each needs a parallel `imageSrcSet?: string` prop
  threaded down from the page that owns the query.
- **A field selected at exactly one size.** `backgroundImage(size: 1024, format: WEBP)` yields a
  single candidate, `buildSaleorSrcSet` correctly returns `undefined`, and the component falls
  back. Correct behaviour, but on a category tile grid it means every tile is billed. Add the
  sibling aliases.

Audit by grepping for the import, not by reading call sites:

```bash
grep -rl 'from "next/image"' src/ui/
```

For anything Saleor-backed on that list, either add the extra aliased rungs and switch to the
`<img srcset>` path, or accept the cost deliberately. Where the fallback is intentional — a fixed
80px cart thumbnail is not worth three rungs — leave a comment saying so, or someone will
re-litigate it later.

Where a component's props make the fallback invisible, make the rung fields **required** in the
TypeScript type rather than optional. A dropped GraphQL alias then fails `tsc` instead of silently
moving spend back onto the optimizer.

## What this does not fix

- **Thumbnail generation load on Saleor.** Item 5 moves work rather than removing it.
- **Cold-start cost on genuinely dynamic routes.** Cart, checkout, and account pages have to render.
- **Staleness when webhooks are not configured.** Item 7 widens the window from 60 seconds to an
  hour. If you have no webhooks, keep the backstop tight and accept the cost.
