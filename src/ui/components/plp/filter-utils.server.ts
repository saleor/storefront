import "server-only";

import { CategoriesBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

/**
 * Resolve category slugs to IDs via Saleor API.
 * Cached for 1 hour.
 *
 * Server-only: Uses executePublicGraphQL which requires server context.
 */
export async function resolveCategorySlugsToIds(
	slugs: string[],
): Promise<Map<string, { id: string; name: string }>> {
	const result = new Map<string, { id: string; name: string }>();
	if (slugs.length === 0) return result;

	const queryResult = await executePublicGraphQL(CategoriesBySlugDocument, {
		variables: { slugs, first: slugs.length },
		revalidate: 3600,
	});

	if (queryResult.ok && queryResult.data.categories?.edges) {
		queryResult.data.categories.edges.forEach(({ node }) => {
			result.set(node.slug, { id: node.id, name: node.name });
		});
	} else if (!queryResult.ok) {
		console.error("[filter-utils] Failed to resolve category slugs:", queryResult.error.message);
	}

	return result;
}
