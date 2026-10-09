export type ListingViewParams = {
	cursor?: string | string[];
	direction?: string | string[];
	sort?: string;
	price?: string;
	colors?: string;
	sizes?: string;
	categories?: string;
	/** Search text. Only the search surface reads this. */
	query?: string;
	/** 1-based offset page. Cursor providers ignore it. */
	page?: string;
};

/**
 * True when a listing view is safe and worthwhile to cache.
 * Any active filter, or any cursor, makes the view a long-tail entry.
 */
export function isCacheableListingView(params: ListingViewParams): boolean {
	return (
		!params.cursor &&
		!params.page &&
		!params.query &&
		!params.price &&
		!params.colors &&
		!params.sizes &&
		!params.categories
	);
}
