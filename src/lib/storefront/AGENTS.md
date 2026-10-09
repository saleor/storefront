# Storefront contract

This directory is Paper core. Forks do not edit it.

`contract/` is the view-model types templates receive. `mappers/product.ts` builds a `ProductView` from the cached product shell. Extra fields go through `src/config/storefront-view.ts`, not through a change here.

Layout lives in `src/templates/`. See `skills/saleor-paper-storefront/rules/ui-templates.md`.
