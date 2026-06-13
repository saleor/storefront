# Detect — locale-channel routing

## Already applied?

- `src/app/(storefront)/[locale]/[channel]/(main)/` exists
- `buildStorefrontPath` in `src/lib/storefront-path.ts`
- `middleware.ts` redirects `/{channel}/…` → `/{locale}/{channel}/…`
- `StorefrontContentPages.graphql` includes `$languageCode`

## Applicable?

Any fork exposing multiple languages or markets in the browse URL.
