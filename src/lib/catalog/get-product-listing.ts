import {
	ProductListByCategoryDocument,
	ProductListByCollectionDocument,
	ProductListPaginatedDocument,
	type ProductListByCategoryQuery,
	type ProductListByCollectionQuery,
	type ProductListPaginatedQuery,
	type ProductOrder,
} from "@/gql/graphql";
import "server-only";

import { ProductsPerPage } from "@/app/config";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

export { isCacheableListingView, type ListingViewParams } from "./listing-view";

/**
 * Cached listing grids for the high-traffic views.
 *
 * ## Why this exists
 *
 * Listing grids used to run uncached `executePublicGraphQL` inside the `searchParams`
 * Suspense island, so every PLP request — every crawl, every page, every filter
 * permutation — paid a full Saleor round trip and a full RSC render. That is the
 * busiest surface in the storefront and it cached nothing.
 *
 * ## Why only *some* views
 *
 * Caching every filter/cursor permutation would trade invocation cost for unbounded
 * cache-write cost. Instead {@link isCacheableListingView} admits only the unfiltered
 * first page (in any sort order), which carries the bulk of real traffic. Filtered and
 * deep-paginated views fall through to a live fetch and behave exactly as before.
 *
 * ## Entry cardinality and tag sharding
 *
 * Category/collection slugs are function arguments, so they are part of the cache key:
 * the upper bound is `(1 + categories + collections) × sorts × locales × channels`, not
 * `sorts × locales × channels`. Only *visited* grids materialize, so real cost tracks
 * traffic rather than catalog size — but that cardinality is exactly why the cache tags
 * are sharded per surface/slug (`listing:all|category|collection`, see cache-manifest.ts).
 * A single channel-wide tag here would let one product edit mark every materialized grid
 * in the channel stale at once — a regeneration storm per webhook.
 *
 * ## Failure semantics
 *
 * A failed request **throws** so nothing is written to the cache; the listing
 * Suspense / API caller surfaces the error and the next request retries. Returning null here instead would
 * cache the failure and serve a 404 for the whole grid until the entry expired — one
 * blip in Saleor becoming an hour of missing catalog. Only a genuinely absent entity
 * returns null, which is a real result and safe to cache.
 */

type ListingConnection = NonNullable<ProductListPaginatedQuery["products"]>;

/** Cached first page of the all-products grid. */
export async function getProductListingPage(
	channel: string,
	localeSlug: string,
	sortBy: ProductOrder | undefined,
): Promise<ListingConnection | null> {
	"use cache";

	const data = await cachedQuery(ProductListPaginatedDocument, {
		profile: CACHE_PROFILES.listingAll,
		tag: { channel },
		variables: {
			first: ProductsPerPage,
			after: null,
			channel,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	return data.products ?? null;
}

type CategoryListing = NonNullable<ProductListByCategoryQuery["category"]>;

/**
 * Cached first page of a category grid.
 * Takes the category's **primary** slug — callers resolve translated slugs via
 * `getCategoryData` first, so this never needs `slugLanguageCode`.
 */
export async function getCategoryListingPage(
	categorySlug: string,
	channel: string,
	localeSlug: string,
	sortBy: ProductOrder | undefined,
): Promise<CategoryListing["products"] | null> {
	"use cache";

	const data = await cachedQuery(ProductListByCategoryDocument, {
		profile: CACHE_PROFILES.listingCategory,
		tag: { channel, slug: categorySlug },
		variables: {
			slug: categorySlug,
			channel,
			first: ProductsPerPage,
			after: null,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	return data.category?.products ?? null;
}

type CollectionListing = NonNullable<ProductListByCollectionQuery["collection"]>;

/** Cached first page of a collection grid. Takes the collection's **primary** slug. */
export async function getCollectionListingPage(
	collectionSlug: string,
	channel: string,
	localeSlug: string,
	sortBy: ProductOrder | undefined,
): Promise<CollectionListing["products"] | null> {
	"use cache";

	const data = await cachedQuery(ProductListByCollectionDocument, {
		profile: CACHE_PROFILES.listingCollection,
		tag: { channel, slug: collectionSlug },
		variables: {
			slug: collectionSlug,
			channel,
			first: ProductsPerPage,
			after: null,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	return data.collection?.products ?? null;
}
