# Plan: Paper cost efficiency

Living catalog of **this repo**. Do not put merchant names, hostnames, invoice
figures, or a single “N× page views” ratio here.

Status: `done` · `next` · `later` · `measure`

---

## Done (this pass)

- [x] No `prefetch={true}` on mega-menu “All products”, homepage hero/editorial CTAs.
- [x] Footer / legal links `prefetch={false}` so a fat unique-path menu does not fan out RSC on first paint.
- [x] `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT` (default on; `0` skips `listing:all` on product events).
- [x] `robots.ts` disallows `/*?*query=`.
- [x] `pnpm har:analyze` + HAR capture recipe in `paper-vercel-cost`.
- [x] Cost rule: why edge requests outnumber page views; high-churn / subpath / outer-CDN playbook.
- [x] `*.har` gitignored.
- [x] HAR classifier: Saleor thumbnail 302s and leftover `text/html` 403s (manifest, ads) are not “challenge page” or “HTML redirect”.

---

## Next (high leverage in Paper)

| ID  | Change                                                                                                                                                                                                                                                                                                                                  | Why                                                                                                                                        | Where                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| P1  | **Canonical PLP without awaiting `searchParams`.** Empty-query first page should be a full CDN hit; filters move to a client island + route handler.                                                                                                                                                                                    | Playbook #1. Every `/products` view still pays a function to discover “no query”.                                                          | `products/page.tsx`, category/collection twins        |
| P2  | **CI guard: no new `prefetch={true}`.** Fail `verify` if it appears outside an explicit allowlist (empty by default).                                                                                                                                                                                                                   | Comments already forbid it; a fork will re-add it on a hero. Full prefetch of a `searchParams` page can emit several RSC flights per CTA.  | `eslint.config.mjs` or a small `scripts/` check       |
| P3  | **Marketing images have no Saleor ladder.** `/public` and Model/Page `FILE` / `file_upload` URLs are originals. Default path: one pre-encoded WebP per slot + plain `<img>`. Keep `next/image` only for tiny slots. **PDP thumb strip:** if it stays on `next/image`, `src` must be a 256/512 Saleor rung — never the 2048 gallery URL. | Homepage optimizer bill is `/public` (and leftover FILE) originals; thumbs sourced from a 2048 proxy pay a transform Vercel should not do. | `saleor-image.tsx`, `image-carousel.tsx`, `ui-images` |
| P4  | **Browse layout: do not load unused font files.** Geist Mono is barely used on browse.                                                                                                                                                                                                                                                  | Extra edge + FDT on every view.                                                                                                            | `src/lib/fonts.ts`, checkout keeps mono               |

---

## Later (Paper, after P1–P4)

| ID  | Change                                                                                                           | Why                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| P6  | First-class `basePath` / subpath: middleware matcher, `robots.ts`, cookie `path`, session-bridge, `assetPrefix`. | Forks invent this; a wrong matcher or extra 308 is an edge request on every landing. |
| P7  | Search rate-limit + document that `prefetch` must never point at `/search`.                                      | Search is always uncached.                                                           |
| P8  | Saleor retry budget / circuit breaker.                                                                           | Incident × retries = provisioned-memory burn.                                        |
| P9  | Optional `assetPrefix` example + purge notes.                                                                    | Only when FDT overage is material.                                                   |
| P10 | Raise catalog backstops (1 d / 1 w) behind a “webhooks proven” checklist.                                        | Do not ship as default.                                                              |

---

## Measure (Paper)

- [ ] `pnpm har:analyze` on Paper’s own production (or preview) homepage — baseline for this repo.
- [ ] After P1: share of `/products` requests that are function invocations (Vercel, 7-day).
- [ ] After P3: `/_next/image` count on a homepage HAR should be ~0 if the page has no CMS-only leftovers.

---

## Out of scope for Paper

- Merchant pixels (GTM, ad networks). Paper does not ship them.
- Outer-CDN cache rules for a specific hostname.
- Flattening a merchant’s layered banner art.
- Setting `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT=0` as the default (would stale `/products` for low-churn shops).
