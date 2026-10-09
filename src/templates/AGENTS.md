# Templates

This directory is fork-owned. Paper upgrades do not overwrite it.

A template arranges `product` (`ProductView`) and `slots` (gallery, buy box, breadcrumbs, attributes). It does not fetch, cache, or read the request.

Read `skills/saleor-paper-storefront/rules/ui-templates.md` before adding or changing a layout.

- A new PDP layout is a file in `src/templates/pdp/`, registered in `src/templates/pdp/registry.ts`.
- Select it with `ACTIVE_PDP_TEMPLATE` and `ACTIVE_PDP_GALLERY` in `src/config/template-selection.ts`. Those two values must match the template's `gallery` field.
- Place `slots.gallery` and `slots.buyBox` exactly once.
- Do not edit the product route, `gallery-layout.ts`, or `src/lib/storefront` for a layout change.
- Do not import `@/gql`, `@/lib/saleor`, or loaders from a template. Do not read `searchParams`, cookies, or headers there.
- A missing field goes in `src/graphql/extensions/ProductDetailsExtension.graphql` and `mapProductExtensions` in `src/config/storefront-view.ts`.
