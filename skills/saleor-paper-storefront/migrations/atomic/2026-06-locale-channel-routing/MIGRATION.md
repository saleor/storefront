# Locale + channel browse routing

Ports `/{locale}/{channel}/…` browse URLs, GraphQL `languageCode`, region picker, per-locale caching, SEO hreflang, and optional locale×channel pair allowlist.

## When to apply

Fork is on pre-locale `/{channel}/…` routes, or missing:

- `src/app/(storefront)/[locale]/[channel]/…`
- `src/lib/storefront-path.ts`, `src/middleware.ts` legacy redirects
- `graphqlLanguageCodeVariables` on catalog/menus/content
- `StorefrontRegionPicker`, `buildBrowsePageMetadata`

## Key files

| Area          | Paths                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| Routes        | `src/app/(storefront)/[locale]/`                                        |
| Locale config | `src/config/locale.ts`, `src/config/locale-channel.ts`                  |
| Path helpers  | `src/lib/storefront-path.ts`, `src/lib/browse-locale.ts`                |
| Translations  | `src/lib/graphql-locale.ts`, `src/lib/saleor-translations.ts`           |
| Content i18n  | `src/graphql/StorefrontContentPages.graphql`, `src/lib/content/saleor/` |
| SEO           | `src/lib/seo/hreflang.ts`, `buildBrowsePageMetadata`                    |
| Picker        | `src/ui/components/storefront-region-picker.tsx`                        |
| ADR           | `docs/adr/0001-locale-channel-url-routing.md`                           |

## Env

```env
STOREFRONT_LOCALES=en,pl,de
NEXT_PUBLIC_DEFAULT_LOCALE=en
# Optional pair matrix (default: any allowed locale × any allowed channel)
STOREFRONT_LOCALE_CHANNELS=en:default-channel,pl:channel-pln
```

## Saleor language codes

Map URL slugs to **base** codes in `locale.ts` (`pl` → `PL`, not `PL_PL`). Dashboard translations live under `/translations/PL/…`.

## Checkout

Checkout `languageCode` from browse cookie is a **separate** follow-up — do not block this migration on it.
