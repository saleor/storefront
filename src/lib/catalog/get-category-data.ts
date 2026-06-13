import { ProductListByCategoryDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getCategoryData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.categories, slug);

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: { slug, channel, first: 1, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	if (!result.ok) {
		console.error(`[getCategoryData] Failed to fetch category ${slug}:`, result.error.message);
		return null;
	}

	const category = result.data.category;
	return category ? withTranslatedCategoryFields(category) : null;
}
