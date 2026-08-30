import {
	ProductListByCategoryDocument,
	ProductListByCollectionDocument,
	ProductListPaginatedDocument,
	type ProductListByCategoryQuery,
	type ProductListByCollectionQuery,
	type ProductListPaginatedQuery,
	type ProductOrder,
} from "@/gql/graphql";
import { ProductsPerPage } from "@/app/config";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { executePublicGraphQL } from "@/lib/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

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
 * A failed request **throws** so nothing is written to the cache; the island's
 * ErrorBoundary renders and the next request retries. Returning null here instead would
 * cache the failure and serve a 404 for the whole grid until the entry expired — one
 * blip in Saleor becoming an hour of missing catalog. Only a genuinely absent entity
 * returns null, which is a real result and safe to cache.
 */

export type ListingViewParams = {
	cursor?: string | string[];
	direction?: string | string[];
	sort?: string;
	price?: string;
	colors?: string;
	sizes?: string;
	categories?: string;
};

/**
 * True when a listing view is safe and worthwhile to cache.
 *
 * Any active filter, or any cursor, makes the view long-tail: it would add a cache
 * entry that is unlikely to be read again before it expires.
 */
export function isCacheableListingView(params: ListingViewParams): boolean {
	return !params.cursor && !params.price && !params.colors && !params.sizes && !params.categories;
}

type ListingConnection = NonNullable<ProductListPaginatedQuery["products"]>;

/** Cached first page of the all-products grid. */
export async function getProductListingPage(
	channel: string,
	localeSlug: string,
	sortBy: ProductOrder | undefined,
): Promise<ListingConnection | null> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.listingAll, { channel });

	const result = await executePublicGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: null,
			channel,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		throw new Error(
			`[getProductListingPage] Failed to fetch listing for ${channel}: ${result.error.message}`,
		);
	}

	return result.data.products ?? null;
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
	applyCacheProfile(CACHE_PROFILES.listingCategory, { channel, slug: categorySlug });

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: categorySlug,
			channel,
			first: ProductsPerPage,
			after: null,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		throw new Error(
			`[getCategoryListingPage] Failed to fetch category ${categorySlug} for ${channel}: ${result.error.message}`,
		);
	}

	return result.data.category?.products ?? null;
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
	applyCacheProfile(CACHE_PROFILES.listingCollection, { channel, slug: collectionSlug });

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: collectionSlug,
			channel,
			first: ProductsPerPage,
			after: null,
			sortBy,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		throw new Error(
			`[getCollectionListingPage] Failed to fetch collection ${collectionSlug} for ${channel}: ${result.error.message}`,
		);
	}

	return result.data.collection?.products ?? null;
}
