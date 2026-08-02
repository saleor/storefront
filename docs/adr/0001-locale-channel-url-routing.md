# ADR 0001: Locale and channel URL routing

**Status:** Accepted  
**Date:** 2026-06-12  
**Deciders:** Paper storefront team  
**Implementation:** Shipped — `src/app/(storefront)/[locale]/[channel]/…`, middleware 308 from legacy `/{channel}/…`, GraphQL `languageCode` on catalog/menus/search/CMS.

## Context

Paper storefronts scope commerce by **Saleor channel** (currency, pricing, tax, shipping zones, stock). Language is a separate Saleor concern (`LanguageCodeEnum` translations on products, categories, menus, and Models).

Today:

- Browse routes: `/{channel}/…` (e.g. `/uk/products/hoodie`)
- Locale: single global `en-US` in `src/config/locale.ts`
- Channel picker: footer `<select>`, currency codes only; switch drops to channel homepage
- Checkout: `/checkout` — channel from cart cookie (no locale in path)
- Content cache tags already anticipate locale: `storefront-content:{channel}:{locale}`

International brands need shareable URLs per language **and** market, crawlable `hreflang`, and independent market/language pickers without hiding state in cookies alone.

## Decision

Adopt **orthogonal locale + channel prefixes** for all browse (storefront) routes:

```
/{locale}/{channel}/…
```

**Examples:**

```
/en/uk/products/hoodie
/en/us/products/hoodie
/pl/pl/collections/summer
```

| URL segment | Meaning                                                             | Saleor mapping                   |
| ----------- | ------------------------------------------------------------------- | -------------------------------- |
| `{locale}`  | Language + formatting (`html lang`, `Intl`, GraphQL `languageCode`) | BCP 47 slug → `LanguageCodeEnum` |
| `{channel}` | Market (currency, availability, shipping)                           | Channel slug (unchanged)         |

**Conventions:**

1. **Canonical URLs always include locale** — no “hidden default” `/uk/…` in production (legacy URLs may 301 during migration).
2. **Locale slug format:** lowercase BCP 47 path segments — `en`, `pl`, `de`; use `en-gb` / `en-us` when disambiguating English across channels is needed without relying on channel alone.
3. **Root `/`** redirects to `/{defaultLocale}/{defaultChannel}/` (optional first-visit geo hint; user override via cookie).
4. **Invalid `(locale, channel)` pairs** → `notFound()` or redirect to nearest valid pair (config-driven allowlist).
5. **Checkout stays at `/checkout`** — locale and channel sync from browse via cookies (same pattern as channel today).
6. **Link helpers** prepend both segments; path preservation on market/language switch swaps one segment and keeps the suffix path.

## Alternatives considered

| Option                                   | Rejected because                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `/{channel}/{locale}/…`                  | Market-first ordering is uncommon for SEO/hreflang; language should lead         |
| `/{market-locale}/…` only (e.g. `en-gb`) | Collapses channel into locale; poor fit when language and market are independent |
| Cookie / `?lang=` only                   | Not shareable, weak SEO, ambiguous cache keys                                    |
| Subdomains per region                    | Operational overhead; out of scope for default Paper                             |

## Consequences

### Positive

- Matches Saleor’s channel ≠ language model
- Incremental migration from `/{channel}/` (insert `[locale]` segment)
- Aligns with existing content cache tag shape
- **Catalog cache:** `localeSlug` in `"use cache"` function args → separate entry per language; slug-scoped tags + `buildPathsForAllLocales()` on webhook invalidation (see `data-caching.md`)
- Market switch: `/en/uk/p/…` → `/en/us/p/…`; language switch: `/en/uk/p/…` → `/pl/uk/p/…`

### Negative / costs

- Every `LinkWithChannel` call site and `generateStaticParams` gains a locale dimension
- `generateStaticParams` cardinality: locales × channels (product pages remain on-demand ISR); catalog cache entries also scale with configured locales (one warm entry per locale × page)
- Middleware for root redirect and optional `Accept-Language` negotiation
- 301 redirects required from old `/{channel}/…` URLs

### Follow-up work

1. Checkout — `languageCode` from browse-locale cookie
2. Storefront content — Saleor Models `translation` fields in provider
3. SEO — `hreflang`, canonical, sitemap per locale×channel
4. Migration entry in `skills/…/migrations/` when routing stabilizes

### Completed (reference)

1. App Router: `src/app/(storefront)/[locale]/[channel]/…`
2. `src/config/locale.ts` — locale slugs, Saleor base `languageCode` map, defaults
3. Locale-aware links + `useSelectedPathname` / `buildStorefrontPath`
4. Middleware — root redirect, legacy channel URLs, `browse-locale` cookie
5. `languageCode` on public GraphQL + `withTranslated*Fields` for catalog/menus/CMS
6. Region picker; cache invalidation fan-out across locales
7. Server-rendered `<html lang>` per locale via **multiple root layouts** (see below)

### `<html lang>` rendering — multiple root layouts

`<html lang>` must reflect the URL locale in the **initial server-rendered HTML** (the crawlable/no-JS premise of this ADR). The blocker: a single `app/layout.tsx` renders `<html>` _above_ `[locale]`, so it never sees the locale param. Earlier this was patched client-side in a `useEffect` (`DocumentLang`), which left the SSR/no-JS HTML at the default `lang`.

Decision: drop the shared root layout and use **one root layout per surface** (canonical Next.js i18n, adapted to the two-surface split):

| Root layout                                | `<html lang>`                 |
| ------------------------------------------ | ----------------------------- |
| `(storefront)/[locale]/layout.tsx`         | from URL locale segment (SSR) |
| `(checkout)/layout.tsx`                    | default (locale-less surface) |
| `(root)/layout.tsx` (`/` + global 404/500) | default                       |

- Locale validation moved to `[channel]/layout.tsx` so the storefront root always renders an HTML shell (so the `not-found`/`error` boundaries have one). Invalid locales fall back to the default `htmlLang` and 404 at the channel layer.
- Per-group `error.tsx` / `not-found.tsx` re-export shared UI (`@/ui/components/{error,not-found}-content`); `app/global-error.tsx` covers root-layout crashes.
- File-based metadata (`app/icon.png`, `opengraph-image.png`, …) stays global; **keeps PPR** (no `headers()`/dynamic root).
- Follow-up: checkout `<html lang>` could read the `browse-locale` cookie to localize, at the cost of making the checkout shell dynamic.

## References

- Skill rule: `skills/saleor-paper-storefront/rules/ui-locale-routing.md`
- Channels (today): `skills/saleor-paper-storefront/rules/ui-channels.md`
- Content cache: `skills/saleor-paper-storefront/rules/data-storefront-content.md`
- Locale + catalog cache: `skills/saleor-paper-storefront/rules/data-caching.md`
- Saleor translations: [Multilingual](https://docs.saleor.io/developer/translations)
