import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getCategoryData(slug: string, channel: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.categories, slug);

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: { slug, channel, first: 1 },
	});

	if (!result.ok) {
		console.error(`[getCategoryData] Failed to fetch category ${slug}:`, result.error.message);
		return null;
	}

	return result.data.category;
}
