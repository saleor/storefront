import "server-only";

import { CategoriesBySlugDocument } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery, tagCatalogSlug } from "@/lib/saleor";

/**
 * Resolve category slugs to ids. Cached with the categories profile so a category
 * webhook (and the shared `categories` tag) can bust it.
 */
type CategorySlugHit = { slug: string; id: string; name: string };

export async function resolveCategorySlugsToIds(
	slugs: string[],
): Promise<Map<string, { id: string; name: string }>> {
	if (slugs.length === 0) return new Map();
	// `"use cache"` can only store plain data. Sort so slug order is not part of the key.
	const hits = await resolveCategorySlugsCached([...slugs].sort());
	return new Map(hits.map((hit) => [hit.slug, { id: hit.id, name: hit.name }]));
}

async function resolveCategorySlugsCached(slugs: string[]): Promise<CategorySlugHit[]> {
	"use cache";

	const data = await cachedQuery(CategoriesBySlugDocument, {
		profile: CACHE_PROFILES.categories,
		tag: slugs[0],
		variables: { slugs, first: slugs.length },
	});

	for (const slug of slugs.slice(1)) {
		tagCatalogSlug(CACHE_PROFILES.categories, slug);
	}

	return (data.categories?.edges ?? []).map(({ node }) => ({
		slug: node.slug,
		id: node.id,
		name: node.name,
	}));
}
