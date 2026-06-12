# ADR 0001: Locale and channel URL routing

**Status:** Accepted  
**Date:** 2026-06-12  
**Deciders:** Paper storefront team  
**Implementation:** In progress (`src/app/(storefront)/[locale]/[channel]/…`, middleware 308 from legacy `/{channel}/…`)

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
- Market switch: `/en/uk/p/…` → `/en/us/p/…`; language switch: `/en/uk/p/…` → `/pl/uk/p/…`

### Negative / costs

- Every `LinkWithChannel` call site and `generateStaticParams` gains a locale dimension
- `generateStaticParams` cardinality: locales × channels (product pages remain on-demand ISR)
- Middleware for root redirect and optional `Accept-Language` negotiation
- 301 redirects required from old `/{channel}/…` URLs

### Follow-up work (implementation)

1. App Router: `src/app/(storefront)/[locale]/[channel]/…`
2. `src/config/locale.ts` — available locales, Saleor `languageCode` map, defaults
3. `LinkWithLocaleChannel` (or extend `LinkWithChannel`) + `useSelectedPathname` strip both prefixes
4. Middleware — root redirect, locale cookie
5. Wire `languageCode` through public GraphQL + `getStorefrontContent(channel, locale)`
6. Market/language picker UI (header); path preservation; cart channel warning
7. SEO — canonical URLs, `hreflang`, sitemap per locale×channel
8. Migration entry in `skills/…/migrations/` when routing lands

## References

- Skill rule: `skills/saleor-paper-storefront/rules/ui-locale-routing.md`
- Channels (today): `skills/saleor-paper-storefront/rules/ui-channels.md`
- Content cache: `skills/saleor-paper-storefront/rules/data-storefront-content.md`
- Saleor translations: [Multilingual](https://docs.saleor.io/developer/translations)
