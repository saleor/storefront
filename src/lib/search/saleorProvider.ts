/**
 * Saleor Search Implementation
 *
 * Uses Saleor's built-in GraphQL search for the demo.
 * Replace this with Typesense/Algolia/Meilisearch for production.
 */

import { executeGraphQL } from "@/lib/graphql";
import { SearchProductsDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import type { SearchProduct, SearchResult, SearchPagination } from "./types";
import { localeConfig } from "@/config/locale";

interface SearchOptions {
	query: string;
	channel: string;
	limit?: number;
	cursor?: string;
	direction?: "forward" | "backward";
	sortBy?: "relevance" | "price-asc" | "price-desc" | "name" | "newest";
}

/**
 * Search products using Saleor's GraphQL API.
 *
 * For production, replace this with your search engine of choice.
 * See the examples in ./index.ts for Typesense, Algolia, Meilisearch.
 */
export async function searchProducts(options: SearchOptions): Promise<SearchResult> {
	const { query, channel, limit = 20, cursor, direction = "forward", sortBy = "relevance" } = options;

	const { field, order } = mapSortToSaleor(sortBy);

	// Build pagination - Saleor uses cursor-based pagination
	const isBackward = direction === "backward" && cursor;

	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			search: query,
			channel,
			sortBy: field,
			sortDirection: order,
			first: isBackward ? undefined : limit,
			after: isBackward ? undefined : cursor,
			last: isBackward ? limit : undefined,
			before: isBackward ? cursor : undefined,
		},
		revalidate: 60,
	});

	if (!products) {
		return {
			products: [],
			pagination: { totalCount: 0 },
		};
	}

	// Transform to common SearchProduct format
	const searchProducts: SearchProduct[] = products.edges.map(({ node }) => ({
		id: node.id,
		name: node.name,
		slug: node.slug,
		thumbnailUrl: node.thumbnail?.url,
		thumbnailAlt: node.thumbnail?.alt,
		price: node.pricing?.priceRange?.start?.gross.amount ?? 0,
		currency: node.pricing?.priceRange?.start?.gross.currency ?? localeConfig.fallbackCurrency,
		categoryName: node.category?.name,
	}));

	const pagination: SearchPagination = {
		totalCount: products.totalCount ?? 0,
		hasNextPage: products.pageInfo.hasNextPage,
		hasPreviousPage: products.pageInfo.hasPreviousPage,
		nextCursor: products.pageInfo.endCursor ?? undefined,
		prevCursor: products.pageInfo.startCursor ?? undefined,
	};

	return {
		products: searchProducts,
		pagination,
	};
}

function mapSortToSaleor(sortBy: SearchOptions["sortBy"]): {
	field: ProductOrderField;
	order: OrderDirection;
} {
	switch (sortBy) {
		case "price-asc":
			return { field: ProductOrderField.MinimalPrice, order: OrderDirection.Asc };
		case "price-desc":
			return { field: ProductOrderField.MinimalPrice, order: OrderDirection.Desc };
		case "name":
			return { field: ProductOrderField.Name, order: OrderDirection.Asc };
		case "newest":
			return { field: ProductOrderField.Date, order: OrderDirection.Desc };
		case "relevance":
		default:
			// Saleor doesn't have relevance sort, use Rating as proxy
			return { field: ProductOrderField.Rating, order: OrderDirection.Desc };
	}
}
