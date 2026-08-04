import { ProductListByCategoryDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getCategoryData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	applyCacheProfile(CACHE_PROFILES.categories, decodedSlug);

	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchCategory = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const result = await executePublicGraphQL(ProductListByCategoryDocument, {
			variables: {
				slug: vars.slug,
				channel,
				first: 1,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		if (!result.ok) {
			console.error(`[getCategoryData] Failed to fetch category ${vars.slug}:`, result.error.message);
			return null;
		}

		return result.data.category;
	};

	const category = await resolveByPossiblyTranslatedSlug({
		localeSlug,
		urlSlug: decodedSlug,
		fetchByPrimarySlug: (urlSlug) => fetchCategory({ slug: urlSlug }),
		fetchByTranslatedSlug: (urlSlug, slugLanguageCode) => fetchCategory({ slug: urlSlug, slugLanguageCode }),
	});

	if (!category) return null;

	tagPrimaryCatalogSlug(CACHE_PROFILES.categories, decodedSlug, category.slug);
	return withTranslatedCategoryFields(category);
}
