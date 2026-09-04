---
name: ui-images
description: Images in Paper — Saleor already produces optimized thumbnails, so Vercel's optimizer must not redo that work. Covers the thumbnail ladder, remotePatterns allowlisting, minimumCacheTTL, deviceSizes/imageSizes budgets, and mandatory `sizes` on every fill image. Use when adding an <Image>, tuning image cost, debugging oversized requests, or touching next.config.js images config.
---

# Images

Images are usually the largest line on a Paper storefront's Vercel bill — transformations and image cache writes both scale with the size of the catalog times the number of widths requested. The decisions here are about **not paying twice for the same optimization**.

---

## The one decision: Saleor optimizes, Vercel resizes

> **Saleor already returns a compressed, format-converted thumbnail. Vercel's optimizer should only be picking a width — never redoing the encode from a 4000px original.**

Saleor's `thumbnail(size:, format:)` field does real work server-side:

- It snaps the requested size to a fixed ladder — `[32, 64, 128, 256, 512, 1024, 2048, 4096]` — and picks the **nearest** entry, not the next one up. Asking for 300 gives you 256.
- It converts format (`format: WEBP`) and caches the result.
- The returned URL is one of two shapes, and **this is the part that catches people out**:
  - a **direct storage URL** once the thumbnail has been generated, or
  - a **proxy URL** (`/thumbnail/{id}/{size}/{format}/`) that generates on first hit and 302s to storage.

Both are stable per `(media id, size, format)`.

**The consequence:** you cannot rewrite a Saleor image URL to change its width. The two URL shapes are not interchangeable, and rewriting a direct storage URL produces a 404. Any "custom loader that swaps the size segment" idea dies here — verify against `saleor/thumbnail/utils.py` (`get_image_or_proxy_url`) before trying it.

Saleor Cloud fronts those storage URLs with CloudFront at `cache-control: max-age=604800`. So for catalog images Paper skips `/_next/image` altogether: it asks Saleor for **several rungs at once** and hands the browser a real `srcset`. The optimizer stays in the path only for sources Saleor never produced.

---

## The two pipelines

`NEXT_PUBLIC_PAPER_IMAGE_PIPELINE` (default `saleor`) selects between them; `vercel` is the escape hatch if your Saleor deployment has no CDN in front of media.

|                        | Saleor-native `srcset`                                                                    | `next/image` or plain `<img>`                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Use for                | Product `thumbnail(size, format)` and category/collection `backgroundImage(size, format)` | Everything Saleor does **not** resize: `/public`, Model/Page `FILE` URLs, slots far smaller than the smallest rung |
| Transformations billed | none                                                                                      | `/_next/image`: one per `(src, width, quality)`. Plain `<img>`: none                                               |
| Served by              | Saleor's media CDN                                                                        | Vercel origin (`/public` or optimizer) or the raw FILE host                                                        |
| Width selection        | browser, from the rungs you requested                                                     | optimizer `deviceSizes`, or files you authored                                                                     |

Saleor does **not** run marketing art through that ladder. A Model/Page `FILE` attribute returns the **original** upload URL (often on Saleor CloudFront — CDN, no resize/WebP rungs). Files in Next `/public` get neither. Putting a hero through `SaleorImage` without a rung `srcset` just falls through to `/_next/image`. Uploading the same PNG as a `FILE` and wrapping it in `next/image` is worse: Vercel re-encodes a file already on another CDN.

For that leftover set (logo, homepage banners, tiles that are not category `backgroundImage`):

1. **Prefer one pre-encoded file per slot** (flatten layered PSDs/PNGs to a single WebP) and a plain `<img>` / `srcset` you author. Zero image transformations; you pay FDT for the file you chose.
2. **If the art is category/collection art**, store it as Saleor `backgroundImage` and request the same aliased rungs as catalog cards — that _is_ the thumbnail pipeline.
3. **Keep `next/image` only** when you need the optimizer (tiny slot vs a huge original, or you refuse to maintain two widths). Then `sizes` must match the box, and the source should already be WebP — do not ship 4-layer 2048 px PNGs at `100vw`.

The rung sets live in [`images.ts`](../../../src/lib/images.ts) (`CATALOG_CARD_RUNGS`, `PDP_GALLERY_RUNGS`) and must match the aliased GraphQL fields:

```graphql
thumbnail(size: 1024, format: WEBP) { url alt }
thumbnail256: thumbnail(size: 256, format: WEBP) { url }
thumbnail512: thumbnail(size: 512, format: WEBP) { url }
```

Feed those to `buildSaleorSrcSet()` in the mapper, pass the result to [`<SaleorImage>`](../../../src/ui/atoms/saleor-image.tsx), and it renders a plain `<img srcset sizes>`. With no `srcSet` it falls back to `next/image`, so a surface Saleor can't serve degrades on its own rather than breaking.

Three consequences of leaving the optimizer, all handled but none of them free:

- **Connection setup moves onto the critical path.** `/_next/image` is same-origin, so it reuses the document's connection; Saleor's CDN is a different origin and costs DNS + TCP + TLS before the LCP image's first byte. The storefront root layout emits a `<link rel="preconnect">` from `saleorMediaPreconnectOrigin()`. It carries no `crossOrigin`, because plain `<img>` fetches are not CORS and a mismatched hint warms a connection the load cannot reuse. The origin is derived from `NEXT_PUBLIC_SALEOR_API_URL`; a deployment serving media from a separate domain needs its own hint.
- **`priority` no longer implies a preload.** `next/image` emits one; the `<img>` path asks for it explicitly via `ReactDOM.preload`.
- **A rung you have never requested comes back as a proxy URL, and cached pages bake it in.** `resolve_thumbnail` returns `/thumbnail/{id}/{size}/{format}/` until a `Thumbnail` row exists, so right after adding a rung the prerendered payload is full of URLs that 302 to storage — one extra round trip per image, on the LCP path. It self-heals: the first hit generates the file, the next resolve returns the storage URL, and the next re-render embeds it. On a large catalogue, crawl the new rungs before cutting traffic over. Verify with `curl -sI` on a fresh rung; a `302` means it has not been materialised yet.

Type the rung fields as **required** where you consume them. If a fragment loses an alias, that should fail typecheck, not silently fall back to `/_next/image` and quietly start billing again.

Prefer `next/image` when the slot is far smaller than the smallest rung you request. The PDP thumbnail strip is 80px against a 512 floor, so letting the browser pick a rung would ship ~6× the bytes to save two cheap transformations — the wrong trade.

---

## Cost model

Vercel meters images two ways, and both are driven by **how many distinct URLs you generate**, not how many requests you serve:

| Meter              | Driven by                                               |
| ------------------ | ------------------------------------------------------- |
| Transformations    | unique `(src, width, quality, format)` — first hit only |
| Image cache writes | each transformation's result being stored               |

Every entry in `deviceSizes`/`imageSizes` that a `sizes` attribute can select is a potential transformation **per source image**. A 5,000-product catalog with 8 candidate widths is 40,000 transformations before anyone visits a second page.

That leads to three levers, all in [`next.config.js`](../../../next.config.js):

1. **`minimumCacheTTL`** (Paper: 31 days, override with `NEXT_IMAGE_MIN_CACHE_TTL`). The Next default is 4 hours, which re-optimizes the same unchanged catalog image ~180×/month. Saleor URLs are stable, so a long TTL is nearly free correctness-wise — **except** that replacing an image in place in Saleor reuses the URL, so the old bytes serve until expiry. Uploading as new media always dodges this.
2. **`deviceSizes` / `imageSizes`** — trimmed below the Next defaults. The 2048/3840 steps only serve 4K displays and are the most expensive to generate and store; the 16/32/48 steps are smaller than anything Paper renders.
3. **`formats: ["image/webp"]`** — WebP only. AVIF compresses better but cold-encodes add ~500ms+ to the first `/_next/image` hit, which lands directly on LCP.

---

## `remotePatterns` is a security control, not just config

`/_next/image` will fetch and optimize **any** host it is allowed to, and you are billed for it. A wildcard `hostname: "*"` in production lets anyone use the storefront as a free image CDN by hitting `/_next/image?url=…`.

Paper builds the production allowlist from Saleor Cloud hosts plus the configured `NEXT_PUBLIC_SALEOR_API_URL` host, with extra sources (a DAM, a CMS) added via `IMAGE_ALLOWED_HOSTS`. The wildcard is **development-only**.

---

## Every `fill` image needs `sizes`

Without `sizes`, Next assumes `100vw` and requests the widest candidate in `deviceSizes` — so an 80px cart thumbnail downloads a 1920px image. This is the single most common image bug and it is invisible locally, where everything is fast.

Shared `sizes` strings live in [`src/lib/images.ts`](../../../src/lib/images.ts), keyed to the layout breakpoints they describe (`PLP_IMAGE_SIZES`, `PDP_MAIN_IMAGE_SIZES`, `CART_THUMBNAIL_IMAGE_SIZES`, …). Add a constant there rather than inlining a string, so the value stays reviewable next to the others.

```tsx
<Image
	src={product.image}
	alt={product.imageAlt || product.name}
	fill
	sizes={PLP_IMAGE_SIZES}
	quality={PRODUCT_IMAGE_QUALITY}
	className="object-cover"
/>
```

Fixed-size images (`width`/`height`) are self-bounding and don't need `sizes` — Next requests roughly `width` and `width × 2`.

`quality` is pinned at `PRODUCT_IMAGE_QUALITY` (75). Next 16 defaults `images.qualities` to `[75]`, so any other value is silently coerced unless you widen the allowlist — and each distinct quality multiplies the transformation count.

A `sizes` constant describes a **layout**, not a surface. `PLP_HERO_IMAGE_SIZES` is `100vw` because a hero is genuinely edge-to-edge; reusing it on a `lg:grid-cols-2` panel asks for double the pixels that surface ever displays. Match the constant to the column width, or add one.

---

## Every `thumbnail` selection needs `size:` and `format:`

A bare `thumbnail { url }` is not "the default, which is fine". Saleor's `resolve_thumbnail` defaults to **256px in the image's original format** — so a PNG product shot arrives as a PNG, and Vercel is then billed to transcode it to WebP on every distinct width. Passing `format: WEBP` moves that conversion to Saleor, where it is free and cached.

```graphql
thumbnail(size: 256, format: WEBP) {
	url
	alt
}
```

Pick `size:` from the ladder at or just above the largest rendered slot in **device** pixels — the CSS box times the retina factor. A 128px slot on a 2× screen needs 256, not 128.

The PDP **thumb strip** is an 80px slot. It must use a 256 (or 512) Saleor rung (`thumbSrc` / `url256`) via `SaleorImage` — never the 2048 gallery URL through `next/image`. Main-stage `srcset` stays 512/1024/2048 (`PDP_GALLERY_RUNGS`).

---

## Anti-patterns

❌ `fill` without `sizes` — requests the widest variant for a thumbnail slot
❌ `hostname: "*"` in `remotePatterns` for production — third parties bill you
❌ A custom loader that rewrites Saleor thumbnail URL widths — the two URL shapes aren't interchangeable
❌ Adding AVIF to `formats` — doubles transformations and cold-encode cost lands on LCP
❌ Per-call-site `quality` values — each one is a separate transformation of the same image
❌ Widening `deviceSizes` "just in case" — every entry is a transformation per source image
❌ Requesting a huge Saleor `thumbnail(size:)` and letting Vercel shrink it — pay once, at the source
❌ A bare `thumbnail { url }` — 256px in the original format, so Vercel pays for the WebP conversion
❌ Off-ladder sizes in an aliased rung set — Saleor snaps to the nearest rung, so the `srcset` width descriptor lies about the pixels delivered
❌ Routing a Saleor-backed catalog image through `next/image` when a rung set exists — that is the duplicated encode this rule exists to prevent
❌ Reusing `PLP_HERO_IMAGE_SIZES` on anything that isn't full-bleed — a half-width panel wants `SPLIT_PANEL_IMAGE_SIZES`

---

## Key files

| File                              | Purpose                                                         |
| --------------------------------- | --------------------------------------------------------------- |
| `next.config.js` → `images`       | Allowlist, TTL, width ladders, formats                          |
| `src/lib/images.ts`               | Shared `sizes` strings and quality constant                     |
| `src/graphql/fragments/*.graphql` | `thumbnail(size:, format:)` selections — the source-side budget |
