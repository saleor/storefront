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
- [x] **P2** — ESLint ban on JSX `prefetch={true}` (`PREFETCH_TRUE_ALLOWED_FILES`, empty).
- [x] **P4** — Geist Mono loads on checkout / `global-error` only — not browse `<html>`.
- [x] **P3** — PDP thumb strip uses Saleor 256/512 (`url256`), not the 2048 gallery URL through `next/image`.
- [x] **P1** — Canonical PLP is params-only; filters / sort / cursor swap via `GET /api/listing`.

---

## Later (Paper)

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
- [ ] Share of `/products` requests that are function invocations (Vercel, 7-day) after the params-only PLP.
- [ ] `/_next/image` on a homepage HAR should stay limited to CMS/`/public` leftovers; PDP thumbs should not request `w=` sources of the 2048 gallery URL.

---

## Out of scope for Paper

- Merchant pixels (GTM, ad networks). Paper does not ship them.
- Outer-CDN cache rules for a specific hostname.
- Flattening a merchant’s layered banner art.
- Setting `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT=0` as the default (would stale `/products` for low-churn shops).
