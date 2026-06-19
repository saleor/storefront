# Design Verification Gates

The checks to run after molding UI — the "autofixer loop" that keeps generated/edited design Paper-correct, fast, and accessible. **Advisory-first by design**: one unambiguous hard gate, everything else is a guided review you fix before finishing. This protects hand-coder DX (no brittle CI walls) while still catching the common mistakes.

> Run after the [`design-quality-rubric`](design-quality-rubric.md) self-check. Pairs with [`page-composition`](page-composition.md) (PPR rules) and [`ui-design-system`](ui-design-system.md) (tokens).

## Hard gate (must pass)

| Gate          | Command                       | Catches                                                                                    |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Design tokens | `pnpm run lint:design-tokens` | Raw hex / `rgb()` / `hsl()` in `src/ui/**/*.tsx` styling — use a `brand.css` token instead |
| Types         | `pnpm exec tsc --noEmit`      | Type errors (incl. cva `VariantProps`)                                                     |
| Lint          | `pnpm run lint`               | ESLint / Next rules                                                                        |

The design-token gate (`scripts/check-design-tokens.mjs`) scans component styling only — color _data_ in `.ts` (swatch maps, fixtures) is excluded. Rare legitimate literal? Add a `design-tokens-allow` comment on that line.

## Advisory checks (review, don't block)

Fix these when molding; they are judgment calls, so they stay manual rather than failing CI:

- **Unnecessary `"use client"`** — did a section/component become a Client Component without needing state, effects, event handlers, or browser APIs? Default to Server Components (`paper-architecture`, `page-composition`). Grep new `"use client"` directives and justify each.
- **PPR / cache boundaries** — no `await searchParams` / `cookies()` in the shell or inside `"use cache"`; runtime UI lives in nested `<Suspense>` islands; catalog/content fetches use `applyCacheProfile` (`data-caching`). Verify with a build for PPR-sensitive routes: `pnpm run build`.
- **LCP** — PDP keeps the default-image `<link rel="preload">` + `priority` on the first gallery image; no heavier hero displacing it (`product-pdp`).
- **Client JS budget** — prefer composition over shipping large client components; isolate the interactive part.
- **Content boundary** — marketing copy comes from `getStorefrontContent()`; functional strings from next-intl — not hardcoded (`data-storefront-content`, `ui-i18n`).

## Accessibility / UX pass

For anything user-facing, run the external **`web-design-guidelines`** skill (Web Interface Guidelines audit): focus-visible states, heading order (one `h1`), contrast, tap targets, reduced motion, form semantics. Treat its findings as part of "done", especially the mobile non-negotiables in `design-quality-rubric`.

## When to run what

| Change                                        | Gates                                             |
| --------------------------------------------- | ------------------------------------------------- |
| Token / styling tweak                         | `lint:design-tokens` + `tsc` + rubric self-check  |
| New / moved section                           | above + advisory review + `web-design-guidelines` |
| Page layout / Suspense change (PDP, homepage) | above + `pnpm run build` (PPR)                    |
| Anything shipped to users                     | full self-check + all gates + a11y pass           |

## Anti-patterns

❌ Declaring a design done without the rubric self-check or these gates
❌ Hardcoding a color to dodge `lint:design-tokens` instead of adding/using a token
❌ Sprinkling `design-tokens-allow` to silence real violations
❌ Turning advisory checks into hard CI walls that block prototyping (keep them guided)
❌ Skipping a build on PPR-sensitive layout changes and shipping a dynamic-hole regression
