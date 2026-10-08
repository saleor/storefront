---
name: plp-listing
description: PLP and search listings. ListingQuery in, ListingResult out, one provider per surface (Saleor or a search engine). Use when changing category, collection, all-products, or search pages, facets, or /api/listing.
---

# PLP listing

A listing page is a `ListingQuery` for one surface. Core picks the provider for that surface, then decides whether the result is cached. The provider only fetches. The same PLP template renders every surface.

Categories can stay on Saleor while `/search` uses a search engine. Do not split one surface across two backends — the ranking would jump when the first filter is applied.

## What you may edit

| Change                         | Where                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Which backend serves a surface | `LISTING_PROVIDERS` in `src/config/listing-providers.ts`                           |
| A new backend                  | `src/lib/listing/providers/<id>/`, then register it in that config                 |
| Which attributes are facets    | `src/config/facets.ts` (`source` per provider)                                     |
| Rearrange the listing page     | `src/templates/plp/<name>.tsx`, then `ACTIVE_PLP_TEMPLATE` and `ACTIVE_PLP_FACETS` |

`LISTING_PROVIDER_SEARCH=fixture` (and the same shape for `ALL`, `CATEGORY`, `COLLECTION`) overrides one surface at runtime for local runs, tests, and previews. It is ignored when `VERCEL_ENV=production`: production picks providers in `src/config/listing-providers.ts`. Bracket access on `process.env` — do not write `process.env.LISTING_PROVIDER_SEARCH`.

## What a provider returns

`ListingResult`: card views, facets, the sorts that provider supports, a cursor or offset page, and a total. `count` is optional. Templates and the filter bar must render when it is missing. Saleor builds facet values from the current page sample and sets no counts. A search engine sets counts.

`load` returns `null` when a category or collection slug does not exist. Transport failures throw.

`load` receives a query core has already normalized for it. The sort is one the provider declared for that surface (or `undefined` for the surface default). The page is in the provider's pagination mode. A provider does not re-check either.

## What core keeps

- URL codec (`src/lib/listing/query.ts`) and `/api/listing`
- Normalization in `loadListing`, before the cache key. A sort the provider did not declare falls back to the surface default. A page in the wrong mode (`?page=2` on a cursor provider, a cursor on an offset provider) falls back to the first page. A shared URL from another backend never breaks the page
- `isCacheableListingQuery` — first page only, any sort. Search, filters, cursors, and deeper pages are live
- Saleor webhook tags for `freshness: "saleor-webhooks"`
- `listingTtl` (no tag) for `freshness: "ttl"`
- The route files. They do not await `searchParams` in `Page` except to pass them into `redirectToCanonicalCatalogSlug`. Search reads them inside the Suspense child.

Do not edit `src/lib/listing/policy.ts` to change a layout or to plug in a backend.

## Add a provider

```ts
export const algoliaListingProvider: ListingProvider = {
	id: "algolia",
	capabilities: {
		surfaces: ["search"],
		facetCounts: true,
		pagination: "offset",
		sorts: { search: ["relevance", "newest", "price_asc", "price_desc"] },
	},
	freshness: { kind: "ttl", profile: "listingTtl" },
	async load(query) {
		// map ListingQuery to the engine and return ListingResult
	},
};
```

Register it and set `search: "algolia"`. `pnpm paper:new provider listing <id>` scaffolds the provider and its contract test (`src/lib/listing/providers/<id>/contract.test.ts`). That test calls `runListingProviderContract` from `src/lib/listing/testing.ts` with a stub transport, so it runs without the engine. A core test fails when a registered provider has no contract test.

Saleor-only types (`ProductWhereInput`, listing documents) are a lint error outside `src/lib/listing/providers/<id>/`. Providers cannot use `"use cache"`.

## Saleor provider

`src/lib/listing/providers/saleor/` serves every surface by default. Category, collection, and all-products grids use `where` (or `filter` with no facets). Search uses the top-level `search` argument with the same constraints as the grids, so facet aliases (`color` | `colour`, `size` | `shoe-size`) OR the same way on every surface. Search "relevance" sorts by `RANK`. Facet values come from the current page sample; Saleor sets no counts.

## Add a template

Same slots on every preset: `header`, `results`, `empty`. Place each once. `facets` is `bar` or `sidebar` and must match `ACTIVE_PLP_FACETS`. The results island owns the grid, filters, sort, and pagination. A template does not import `@/lib/listing`, `@/lib/saleor`, or `@/gql`.
