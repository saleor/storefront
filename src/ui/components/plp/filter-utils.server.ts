import "server-only";

import { CategoriesBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

/**
 * Resolve category slugs to IDs via Saleor API.
 * Cached for 1 hour.
 *
 * Server-only: Uses executeGraphQL which requires server context.
 */
export async function resolveCategorySlugsToIds(
	slugs: string[],
): Promise<Map<string, { id: string; name: string }>> {
	const result = new Map<string, { id: string; name: string }>();
	if (slugs.length === 0) return result;

	try {
		const { categories } = await executeGraphQL(CategoriesBySlugDocument, {
			variables: { slugs, first: slugs.length },
			revalidate: 3600,
		});
		categories?.edges?.forEach(({ node }) => {
			result.set(node.slug, { id: node.id, name: node.name });
		});
	} catch (error) {
		console.error("[filter-utils] Failed to resolve category slugs:", error);
	}

	return result;
}
