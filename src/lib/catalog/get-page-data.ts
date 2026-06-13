import { PageGetBySlugDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedPageFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getPageData(slug: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.pages, slug);

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	if (!result.ok) {
		console.error(`[getPageData] Failed to fetch page ${slug}:`, result.error.message);
		return null;
	}

	const page = result.data.page;
	return page ? withTranslatedPageFields(page) : null;
}
