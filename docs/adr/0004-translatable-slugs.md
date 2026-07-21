# ADR 0004: Saleor translatable catalog slugs

**Status:** Accepted (phase 1 in progress)  
**Date:** 2026-07-21  
**Deciders:** Paper storefront team  
**Related:** [0001 Locale and channel URL routing](./0001-locale-channel-url-routing.md)

## Context

Saleor (since 3.21) lets merchants translate **URL slugs** for Product, Category, Collection, and Page. Translations store an optional `slug` per `language_code`, unique within `(language_code, slug)` per entity type. Single-object queries accept `slugLanguageCode`:

```graphql
product(slug: "bluza", channel: "pl", slugLanguageCode: PL) { … }
```

Important API constraints (verified in Saleor source):

- **No automatic fallback** — translated lookup and primary lookup are exclusive; the client must try both.
- **Lookup-only** — list filters (`slugs: […]`), search, and `where` match **primary** slugs only.
- **Optional per entity** — a locale may translate names without translating the slug.
- **Webhooks** — `TRANSLATION_CREATED` / `TRANSLATION_UPDATED` fire on slug edits; `PRODUCT_UPDATED` does not.

Paper already routes as `/{locale}/{channel}/…` and merges display translations (`name`, SEO, …) but always resolves and links by the **primary** slug. That blocks localized SEO URLs.

## Decision

Support translated slugs as an **opt-in merchant capability**. When a translation slug is absent, behavior stays identical to today (primary slug in every locale).

### Rules

1. **Primary `slug` remains identity** — GraphQL `entity.slug` is never overwritten; URLs use `translation.slug ?? slug` via `pickTranslatedSlug`.
2. **Resolve with ordered fallback** (every locale): try `slugLanguageCode` first, then primary slug. Link helpers may emit a translated slug on the default locale too, so skipping that lookup would 404.
3. **Canonical redirect** — if the URL slug is not the canonical slug for that locale, `308`/`permanentRedirect` to the translated (or primary) canonical path.
4. **Cache tags** — always tag with the **primary** slug (webhook identity). When the URL slug differs, also tag with the URL slug so either form invalidates.
5. **Link generation** — cards, menus, breadcrumbs, JSON-LD, and metadata path suffixes use `pickTranslatedSlug`.
6. **Filters / search** — keep using primary slugs (API limitation).
7. **Language switch** — region picker rewrites catalog detail suffixes to the **primary** slug (via `CatalogIdentityBridge`), preserves query string, then the target locale’s server resolve + rule 3 308 to that locale’s canonical slug. Never keep a foreign-language handle in the path.

### Phased delivery

| Phase  | Scope                                                                                        | Status      |
| ------ | -------------------------------------------------------------------------------------------- | ----------- |
| **1**  | Resolve + fallback + dual cache tags + canonical redirect + link fields on catalog/menus/PLP | Shipped     |
| **1b** | Language switch via primary slug + query preserve (`CatalogIdentityBridge`)                  | This change |
| **2**  | Per-locale hreflang / sitemap path suffixes (needs all locale slugs in one metadata fetch)   | Follow-up   |
| **3**  | `TRANSLATION_*` webhook handling in `/api/revalidate`                                        | Follow-up   |

### Merge note (Next.js 16.3 preview)

This work targets `main` and should cherry-pick/merge cleanly into `feat/nextjs-16.3-preview`. Avoid structural edits to `cache-manifest.ts` (that file already drifts on 16.3); dual-tagging uses existing `buildTag` + `cacheTag` at call sites.

## Alternatives considered

| Option                                          | Rejected because                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| Always URL = primary slug                       | Leaves Saleor's translated-slug feature unused; weak local SEO                       |
| Overwrite `entity.slug` with translation        | Breaks cache tags and webhook identity                                               |
| Single query without `slugLanguageCode` retry   | API has no fallback; translated URLs 404                                             |
| Full hreflang + translation webhooks in phase 1 | Larger blast radius; hreflang needs multi-locale slug fetch not required for resolve |

## Consequences

- Non-default locales (and the default locale when a translation slug exists) may issue **two** GraphQL lookups on cold primary-slug URLs (then redirect). After links emit translated slugs, the common path is one lookup.
- Merchants who never set translation slugs see no URL change.
- Until phase 2, `hreflang` alternates may still share one path suffix across locales (canonical URL for the current locale is correct).
- Until phase 3, editing only a translation slug may leave stale cache until TTL or a product/category update webhook.
