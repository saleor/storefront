/**
 * Search Types
 *
 * This module provides MINIMAL types for rendering search results.
 * It intentionally does NOT define a rigid provider interface.
 *
 * Why? Each search engine (Algolia, Typesense, Meilisearch) has unique
 * capabilities that shouldn't be limited by a lowest-common-denominator interface:
 *
 * - Algolia: InstantSearch, AI recommendations, personalization, analytics
 * - Typesense: Vector search, geo search, curations, scoped API keys
 * - Meilisearch: Tenant tokens, multi-search, filterable attributes
 *
 * Instead, we provide:
 * 1. A common type for rendering results (SearchProduct)
 * 2. A helper to transform provider results to SearchProduct
 * 3. Example implementations showing how to use each SDK directly
 */

/**
 * Minimal product type for rendering search results.
 * Transform your search engine's response to this format for the UI.
 */
export interface SearchProduct {
	id: string;
	name: string;
	slug: string;
	thumbnailUrl?: string | null;
	thumbnailAlt?: string | null;
	price: number;
	currency: string;
	categoryName?: string | null;
	/** Optional: for highlighting matched text */
	highlights?: {
		name?: string;
		description?: string;
	};
	/** Optional: search relevance score */
	score?: number;
	/** Pass-through for provider-specific data */
	_raw?: unknown;
}

/**
 * Basic pagination info that most providers can supply.
 * Extend with provider-specific fields as needed.
 */
export interface SearchPagination {
	/** Total matching results */
	totalCount: number;
	/** Current page (1-indexed) */
	page?: number;
	/** Total pages */
	totalPages?: number;
	/** For cursor-based pagination */
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	nextCursor?: string;
	prevCursor?: string;
}

/**
 * Facet/filter option returned by search.
 * Most search engines support faceted search.
 */
export interface SearchFacet {
	field: string;
	values: Array<{
		value: string;
		count: number;
		selected?: boolean;
	}>;
}

/**
 * Search result container.
 * The structure is flexible - use what your provider returns.
 */
export interface SearchResult<T = SearchProduct> {
	products: T[];
	pagination: SearchPagination;
	/** Facets/filters if your provider supports them */
	facets?: SearchFacet[];
	/** Query timing */
	queryTimeMs?: number;
	/** Provider-specific metadata */
	meta?: Record<string, unknown>;
}
