# Templates

This directory is fork-owned. Paper upgrades do not overwrite it.

A PDP template arranges `product` (`ProductView`) and `slots` (gallery, buy box, breadcrumbs, attributes). A PLP template arranges `surface` and `slots` (header, results, empty). Neither fetches, caches, or reads the request.

Read `skills/saleor-paper-storefront/rules/ui-templates.md` before adding or changing a layout. Listing backends are `rules/plp-listing.md`.

- A new PDP layout is a file in `src/templates/pdp/`, registered in `src/templates/pdp/registry.ts`.
- Select it with `ACTIVE_PDP_TEMPLATE` and `ACTIVE_PDP_GALLERY` in `src/config/template-selection.ts`. Those two values must match the template's `gallery` field.
- Place `slots.gallery` and `slots.buyBox` exactly once.
- Do not edit the product route, `gallery-layout.ts`, or `src/lib/storefront` for a layout change.
- Do not import `@/gql`, `@/lib/saleor`, or loaders from a template. Do not read `searchParams`, cookies, or headers there.
- A missing PDP field goes in `src/graphql/extensions/ProductDetailsExtension.graphql` and `mapProductExtensions` in `src/config/storefront-view.ts`.
- A new PLP layout is a file in `src/templates/plp/`, registered in `src/templates/plp/registry.ts`. Select it with `ACTIVE_PLP_TEMPLATE` and `ACTIVE_PLP_FACETS`.
- A new listing backend is a provider. Do not edit listing routes or `src/lib/listing/policy.ts` for a layout or a backend.
