import "server-only";

import { PageGetBySlugDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { withTranslatedPageFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getPageData(slug: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchPage = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const data = await cachedQuery(PageGetBySlugDocument, {
			profile: CACHE_PROFILES.pages,
			tag: decodedSlug,
			variables: {
				slug: vars.slug,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		return data.page;
	};

	const page = await resolveByPossiblyTranslatedSlug({
		localeSlug,
		urlSlug: decodedSlug,
		fetchByPrimarySlug: (urlSlug) => fetchPage({ slug: urlSlug }),
		fetchByTranslatedSlug: (urlSlug, slugLanguageCode) => fetchPage({ slug: urlSlug, slugLanguageCode }),
	});

	if (!page) return null;

	tagPrimaryCatalogSlug(CACHE_PROFILES.pages, decodedSlug, page.slug);
	return withTranslatedPageFields(page);
}
