import "server-only";

import { ProductListByCollectionDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { withTranslatedCategoryFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getCollectionData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchCollection = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const data = await cachedQuery(ProductListByCollectionDocument, {
			profile: CACHE_PROFILES.collections,
			tag: decodedSlug,
			variables: {
				slug: vars.slug,
				channel,
				first: 1,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		return data.collection;
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
