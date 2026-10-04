export type ListingViewParams = {
	cursor?: string | string[];
	direction?: string | string[];
	sort?: string;
	price?: string;
	colors?: string;
	sizes?: string;
	categories?: string;
};

/**
 * True when a listing view is safe and worthwhile to cache.
 * Any active filter, or any cursor, makes the view a long-tail entry.
 */
export function isCacheableListingView(params: ListingViewParams): boolean {
	return !params.cursor && !params.price && !params.colors && !params.sizes && !params.categories;
}
