/**
 * Utilities for building Saleor GraphQL filter and sort variables from URL params.
 *
 * This enables server-side filtering when supported by the Saleor query,
 * with fallback to client-side filtering.
 */

import type { ProductOrder, ProductOrderField, OrderDirection, ProductFilterInput } from "@/gql/graphql";
import { CategoriesBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import type { SortOption } from "./FilterBar";

/**
 * Resolve category slugs to IDs via Saleor API.
 * Returns a map of slug -> { id, name } for use in filtering and display.
 *
 * This is a lightweight query that should be cached/memoized in production.
 */
export async function resolveCategorySlugsToIds(
	slugs: string[],
): Promise<Map<string, { id: string; name: string }>> {
	const result = new Map<string, { id: string; name: string }>();

	if (slugs.length === 0) {
		return result;
	}

	try {
		const { categories } = await executeGraphQL(CategoriesBySlugDocument, {
			variables: { slugs, first: slugs.length },
			revalidate: 3600, // Cache category lookups for 1 hour
		});

		categories?.edges?.forEach(({ node }) => {
			result.set(node.slug, { id: node.id, name: node.name });
		});
	} catch (error) {
		console.error("[saleor-filters] Failed to resolve category slugs:", error);
	}

	return result;
}

/**
 * Build Saleor ProductOrder from sort option
 */
export function buildSortVariables(sort: SortOption | string | undefined): ProductOrder | undefined {
	if (!sort || sort === "featured") {
		// Default sort - no explicit sorting
		return undefined;
	}

	const sortMap: Record<string, { field: ProductOrderField; direction: OrderDirection }> = {
		newest: { field: "DATE" as ProductOrderField, direction: "DESC" as OrderDirection },
		price_asc: { field: "PRICE" as ProductOrderField, direction: "ASC" as OrderDirection },
		price_desc: { field: "PRICE" as ProductOrderField, direction: "DESC" as OrderDirection },
		// bestselling would need sales data - fall back to rating or default
		bestselling: { field: "RATING" as ProductOrderField, direction: "DESC" as OrderDirection },
	};

	const mapping = sortMap[sort];
	if (mapping) {
		return mapping;
	}

	return undefined;
}

/**
 * Build Saleor ProductFilterInput from filter parameters
 *
 * Note: Saleor's filtering capabilities depend on your schema version.
 * This function builds filters that work with standard Saleor:
 * - price range filtering
 * - category filtering (requires category IDs)
 * - attribute filtering (if attribute IDs are known)
 */
export function buildFilterVariables(params: {
	priceRange?: string | null;
	minPrice?: number;
	maxPrice?: number;
	categoryIds?: string[];
}): ProductFilterInput | undefined {
	const filter: ProductFilterInput = {};
	let hasFilter = false;

	// Category filter (requires IDs, not slugs)
	if (params.categoryIds && params.categoryIds.length > 0) {
		filter.categories = params.categoryIds;
		hasFilter = true;
	}

	// Price range filter
	if (params.priceRange) {
		const [minStr, maxStr] = params.priceRange.split("-");
		const min = parseFloat(minStr) || 0;
		const max = maxStr ? parseFloat(maxStr) || undefined : undefined;

		filter.price = {
			gte: min,
			...(max && { lte: max }),
		};
		hasFilter = true;
	} else if (params.minPrice !== undefined || params.maxPrice !== undefined) {
		filter.price = {
			...(params.minPrice !== undefined && { gte: params.minPrice }),
			...(params.maxPrice !== undefined && { lte: params.maxPrice }),
		};
		hasFilter = true;
	}

	return hasFilter ? filter : undefined;
}

/**
 * Parse filter and sort from URL search params
 */
export function parseFilterParams(searchParams: URLSearchParams): {
	colors: string[];
	sizes: string[];
	priceRange: string | null;
	sort: SortOption;
} {
	return {
		colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
		sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
		priceRange: searchParams.get("price") || null,
		sort: (searchParams.get("sort") as SortOption) || "featured",
	};
}

/**
 * Sort products client-side (for filters not supported server-side)
 */
export function sortProductsClientSide<T extends { price: number; createdAt?: string | null }>(
	products: T[],
	sort: SortOption | string,
): T[] {
	const sorted = [...products];

	switch (sort) {
		case "price_asc":
			return sorted.sort((a, b) => a.price - b.price);
		case "price_desc":
			return sorted.sort((a, b) => b.price - a.price);
		case "newest":
			return sorted.sort((a, b) => {
				const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
				const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
				return dateB - dateA;
			});
		case "bestselling":
		case "featured":
		default:
			return sorted;
	}
}
