import { ProductListByCollectionDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getCollectionData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, slug);

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: { slug, channel, first: 1, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	if (!result.ok) {
		console.error(`[getCollectionData] Failed to fetch collection ${slug}:`, result.error.message);
		return null;
	}

	const collection = result.data.collection;
	return collection ? withTranslatedCategoryFields(collection) : null;
}
