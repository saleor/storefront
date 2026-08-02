export const SEARCH_SORT_VALUES = ["relevance", "price-asc", "price-desc", "name", "newest"] as const;

export type SearchSortBy = (typeof SEARCH_SORT_VALUES)[number];

export function isSearchSortValue(value: string): value is SearchSortBy {
	return (SEARCH_SORT_VALUES as readonly string[]).includes(value);
}

export function parseSearchSortParam(sortParam: string | undefined): SearchSortBy {
	return sortParam && isSearchSortValue(sortParam) ? sortParam : "relevance";
}
