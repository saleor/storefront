import "server-only";

import { ProductListByCategoryDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getCategoryData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchCategory = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const data = await cachedQuery(ProductListByCategoryDocument, {
			profile: CACHE_PROFILES.categories,
			tag: decodedSlug,
			variables: {
				slug: vars.slug,
				channel,
				first: 1,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		return data.category;
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
