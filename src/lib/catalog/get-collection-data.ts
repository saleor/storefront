import { ProductListByCollectionDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getCollectionData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	applyCacheProfile(CACHE_PROFILES.collections, decodedSlug);

	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchCollection = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const result = await executePublicGraphQL(ProductListByCollectionDocument, {
			variables: {
				slug: vars.slug,
				channel,
				first: 1,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		if (!result.ok) {
			console.error(`[getCollectionData] Failed to fetch collection ${vars.slug}:`, result.error.message);
			return null;
		}

		return result.data.collection;
	};

	const collection = await resolveByPossiblyTranslatedSlug({
		localeSlug,
		urlSlug: decodedSlug,
		fetchByPrimarySlug: (urlSlug) => fetchCollection({ slug: urlSlug }),
		fetchByTranslatedSlug: (urlSlug, slugLanguageCode) =>
			fetchCollection({ slug: urlSlug, slugLanguageCode }),
	});

	if (!collection) return null;

	tagPrimaryCatalogSlug(CACHE_PROFILES.collections, decodedSlug, collection.slug);
	return withTranslatedCategoryFields(collection);
}
