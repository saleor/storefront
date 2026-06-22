/**
 * Saleor Search Implementation
 *
 * Uses Saleor's built-in GraphQL search for the demo.
 * Replace this with Typesense/Algolia/Meilisearch for production.
 */

import { executePublicGraphQL } from "@/lib/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { SearchProductsDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import { toProductCardData } from "@/ui/components/plp/utils";
import type { ProductCardData } from "@/ui/components/plp/product-card-data";
import type { SearchResult, SearchPagination } from "./types";
import type { SearchSortBy } from "./sort-options";

interface SearchOptions {
	query: string;
	channel: string;
	locale: string;
	limit?: number;
	cursor?: string;
	direction?: "forward" | "backward";
	sortBy?: SearchSortBy;
}

/**
 * Search products using Saleor's GraphQL API.
 *
 * For production, replace this with your search engine of choice.
 * See the examples in ./index.ts for Typesense, Algolia, Meilisearch.
 */
export async function searchProducts(options: SearchOptions): Promise<SearchResult<ProductCardData>> {
	const { query, channel, locale, limit = 20, cursor, direction = "forward", sortBy = "relevance" } = options;

	const { field, order } = mapSortToSaleor(sortBy);

	// Build pagination - Saleor uses cursor-based pagination
	const isBackward = direction === "backward" && cursor;

	const result = await executePublicGraphQL(SearchProductsDocument, {
		variables: {
			search: query,
			channel,
			sortBy: field,
			sortDirection: order,
			first: isBackward ? undefined : limit,
			after: isBackward ? undefined : cursor,
			last: isBackward ? limit : undefined,
			before: isBackward ? cursor : undefined,
			...graphqlLanguageCodeVariables(locale),
		},
		revalidate: 60,
	});

	if (!result.ok || !result.data.products) {
		return {
			products: [],
			pagination: { totalCount: 0 },
		};
	}

	const products = result.data.products;

	// ProductListItem fragment includes pricing, variants, and category — map via shared PLP helper.
	const searchProducts = products.edges.map(({ node }) => toProductCardData(node, locale, channel));

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
