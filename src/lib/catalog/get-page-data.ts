import { PageGetBySlugDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedPageFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getPageData(slug: string, localeSlug: string) {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	applyCacheProfile(CACHE_PROFILES.pages, decodedSlug);

	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchPage = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const result = await executePublicGraphQL(PageGetBySlugDocument, {
			variables: {
				slug: vars.slug,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		if (!result.ok) {
			console.error(`[getPageData] Failed to fetch page ${vars.slug}:`, result.error.message);
			return null;
		}

		return result.data.page;
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
