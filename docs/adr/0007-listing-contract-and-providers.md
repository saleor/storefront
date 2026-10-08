# ADR 0007 — Listing contract and providers

## Status

Accepted (implemented)

## Context

Category, collection, and all-products pages already share `/api/listing`, but the Saleor filter shape (`ProductWhereInput`, the `filter`/`where` rule, opaque cursors) was visible to UI code. Search was a second stack with its own sort names. Facet chips were derived from the current page, so a search engine's counts had nowhere to go.

Shops need Saleor for category grids and a search engine for `/search` without forking the routes or the cache policy.

## Decision

`ListingQuery` and `ListingResult` are the storefront contract (`STOREFRONT_CONTRACT_VERSION` 2). `src/config/listing-providers.ts` assigns one provider per surface. Core (`src/lib/listing/policy.ts`) normalizes the query for that provider before the cache key: an undeclared sort falls back to the surface default, and a page in the wrong pagination mode falls back to the first page. Core then caches only the first page of non-search surfaces, in any sort. Saleor-webhook providers use the sharded listing tags. TTL providers use `listingTtl` and no tag.

Every registered provider has a contract test built on the exported `runListingProviderContract`. `LISTING_PROVIDER_<SURFACE>` overrides are for local runs and previews and are ignored on Vercel production.

PLP layout is a template over `header`, `results`, and `empty` slots, the same way the PDP is a template over `ProductView`.

## Consequences

- A new backend is a provider. A new layout is a template. Neither edits the listing routes.
- Saleor still has no facet counts. The contract makes `count` optional.
- Going back a page on category and collection listings uses `$last` / `$before` on a products-only query, so the hero image is not refetched with every filter.
- Search paging and filters use `/api/listing` and stay uncached.
- Saleor search uses the top-level `search` argument with the same constraints as category grids, so facet aliases behave the same on every surface. Relevance sorts by `RANK`, not the deprecated `RATING`.
- A shared URL from another backend (an offset page, an unsupported sort) renders the first page instead of failing.
