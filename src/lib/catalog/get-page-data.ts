import { PageGetBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getPageData(slug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.pages, slug);

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug },
	});

	if (!result.ok) {
		console.error(`[getPageData] Failed to fetch page ${slug}:`, result.error.message);
		return null;
	}

	return result.data.page;
}
