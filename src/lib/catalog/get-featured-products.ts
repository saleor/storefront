import { ProductListByCollectionDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

/**
 * Featured products for the homepage (featured-products collection).
 * Returns [] on failure so callers always render — empty array is cached until revalidation.
 */
export async function getFeaturedProducts(channel: string, limit = 12) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, "featured-products");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: limit,
			sortBy: { field: ProductOrderField.Collection, direction: OrderDirection.Asc },
		},
	});

	if (!result.ok) {
		console.warn(`[getFeaturedProducts] Failed to fetch for ${channel}:`, result.error.message);
		return [];
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}
