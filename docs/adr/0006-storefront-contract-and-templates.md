# ADR 0006: Storefront contract and PDP templates

**Status:** Accepted
**Date:** 2026-10-05

## Decision

Loaders return Saleor results. Templates do not see them. `toProductView` maps the cached product shell into `ProductView` (`STOREFRONT_CONTRACT_VERSION`). The product route owns metadata, the canonical redirect, and the gallery and buy-box islands. It passes the view and those islands as slots to the template selected in `src/config/template-selection.ts`.

A template cannot read `searchParams`, cookies, or Saleor. That keeps a layout change from collapsing the partial prerender. Built-in presets are `immersive` (default), `standard`, `mosaic`, and `columns`. `columns` puts thumbnails on the left of the hero inside the gallery island, so a three-column page does not require a new slot.

Fork fields go through `src/graphql/extensions/ProductDetailsExtension.graphql` and `mapProductExtensions`. Fork layouts live in `src/templates/pdp/`.

## Consequences

Switching presets is `ACTIVE_PDP_TEMPLATE` plus a matching `ACTIVE_PDP_GALLERY`. Painting a second hero from `product.images` above `slots.gallery` steals the LCP frame. The contract test checks that every registered template places `slots.gallery` and `slots.buyBox` once.
