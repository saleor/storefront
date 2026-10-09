# Storefront contract

This directory is Paper core. Forks do not edit it.

`contract/` is the view-model types templates receive. `mappers/product.ts` builds a `ProductView` from the cached product shell. Extra fields go through `src/config/storefront-view.ts`, not through a change here.

`contract/listing.ts` is the listing view (`ListingQuery`, `ListingResult`, `ProductCardView`). Providers in `src/lib/listing/providers/` fill it. Cache policy stays in `src/lib/listing/policy.ts`.

Layout lives in `src/templates/`. See `skills/saleor-paper-storefront/rules/ui-templates.md` and `rules/plp-listing.md`.
