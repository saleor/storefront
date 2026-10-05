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

`LISTING_PROVIDER_SEARCH=fixture` (and the same shape for `ALL`, `CATEGORY`, `COLLECTION`) overrides one surface at runtime. Bracket access on `process.env` — do not write `process.env.LISTING_PROVIDER_SEARCH`.

## What a provider returns

`ListingResult`: card views, facets, the sorts that provider supports, a cursor or offset page, and a total. `count` is optional. Templates and the filter bar must render when it is missing. Saleor builds facet values from the current page sample and sets no counts. A search engine sets counts.

`load` returns `null` when a category or collection slug does not exist. Transport failures throw.

## What core keeps

- URL codec (`src/lib/listing/query.ts`) and `/api/listing`
- `isCacheableListingQuery` — unfiltered first page only, any sort. Search, filters, and cursors are live
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

Register it and set `search: "algolia"`. `pnpm paper:new provider listing <id>` scaffolds the file. Run `runListingProviderContract` against it.

Saleor-only types (`ProductWhereInput`, listing documents) are a lint error outside `src/lib/listing/providers/<id>/`. Providers cannot use `"use cache"`.

## Add a template

Same slots on every preset: `header`, `results`, `empty`. Place each once. `facets` is `bar` or `sidebar` and must match `ACTIVE_PLP_FACETS`. The results island owns the grid, filters, sort, and pagination. A template does not import `@/lib/listing`, `@/lib/saleor`, or `@/gql`.
