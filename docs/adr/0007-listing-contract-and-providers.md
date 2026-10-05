# ADR 0007 — Listing contract and providers

## Status

Accepted

## Context

Category, collection, and all-products pages already share `/api/listing`, but the Saleor filter shape (`ProductWhereInput`, the `filter`/`where` rule, opaque cursors) was visible to UI code. Search was a second stack with its own sort names. Facet chips were derived from the current page, so a search engine's counts had nowhere to go.

Shops need Saleor for category grids and a search engine for `/search` without forking the routes or the cache policy.

## Decision

`ListingQuery` and `ListingResult` are the storefront contract (`STOREFRONT_CONTRACT_VERSION` 2). `src/config/listing-providers.ts` assigns one provider per surface. Core (`src/lib/listing/policy.ts`) caches only the unfiltered first page of non-search surfaces. Saleor-webhook providers use the sharded listing tags. TTL providers use `listingTtl` and no tag.

PLP layout is a template over `header`, `results`, and `empty` slots, the same way the PDP is a template over `ProductView`.

## Consequences

- A new backend is a provider. A new layout is a template. Neither edits the listing routes.
- Saleor still has no facet counts. The contract makes `count` optional.
- Going back a page on category and collection listings uses `$last` / `$before` on a products-only query, so the hero image is not refetched with every filter.
- Search paging and filters use `/api/listing` and stay uncached.
