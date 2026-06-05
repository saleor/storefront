import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getCollectionData(slug: string, channel: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, slug);

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: { slug, channel, first: 1 },
	});

	if (!result.ok) {
		console.error(`[getCollectionData] Failed to fetch collection ${slug}:`, result.error.message);
		return null;
	}

	return result.data.collection;
}
