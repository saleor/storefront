import type { ListingViewParams } from "./get-product-listing";
import type { ProductCardData } from "@/ui/components/plp/product-card-data";

export type ListingSurface = "all" | "category" | "collection";

export type ListingPageInfo = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string | null;
	endCursor?: string | null;
};

export type ListingPayload = {
	products: ProductCardData[];
	pageInfo: ListingPageInfo;
	totalCount: number;
	resolvedCategories: Array<{ slug: string; id: string; name: string }>;
};

const LISTING_QUERY_KEYS = ["cursor", "direction", "sort", "price", "colors", "sizes", "categories"] as const;

function firstString(value: string | string[] | null | undefined): string | undefined {
	if (value == null) return undefined;
	const raw = Array.isArray(value) ? value[0] : value;
	return raw && raw !== "" ? raw : undefined;
}

function hasListingValue(value: string | string[] | null | undefined): boolean {
	return firstString(value) !== undefined;
}

/**
 * True when the URL is the canonical first page the server already rendered
 * (no sort, cursor, or filters). Sort-only is cacheable on the API but is not
 * what the page HTML contains — the client must fetch.
 */
export function isCanonicalListingView(params: ListingViewParams): boolean {
	return (
		!hasListingValue(params.cursor) &&
		!hasListingValue(params.direction) &&
		!hasListingValue(params.sort) &&
		!hasListingValue(params.price) &&
		!hasListingValue(params.colors) &&
		!hasListingValue(params.sizes) &&
		!hasListingValue(params.categories)
	);
}

export function listingViewFromSearchParams(searchParams: URLSearchParams): ListingViewParams {
	return {
		cursor: firstString(searchParams.get("cursor")),
		direction: firstString(searchParams.get("direction")),
		sort: firstString(searchParams.get("sort")),
		price: firstString(searchParams.get("price")),
		colors: firstString(searchParams.get("colors")),
		sizes: firstString(searchParams.get("sizes")),
		categories: firstString(searchParams.get("categories")),
	};
}

export function listingViewFromRecord(params: ListingViewParams): ListingViewParams {
	return {
		cursor: firstString(params.cursor),
		direction: firstString(params.direction),
		sort: firstString(params.sort),
		price: firstString(params.price),
		colors: firstString(params.colors),
		sizes: firstString(params.sizes),
		categories: firstString(params.categories),
	};
}

/** Append listing + identity keys onto a `/api/listing` URL. */
export function applyListingSearchParams(
	target: URLSearchParams,
	input: {
		surface: ListingSurface;
		locale: string;
		channel: string;
		slug?: string;
		view: ListingViewParams;
	},
): void {
	target.set("surface", input.surface);
	target.set("locale", input.locale);
	target.set("channel", input.channel);
	if (input.slug) target.set("slug", input.slug);
	for (const key of LISTING_QUERY_KEYS) {
		const value = firstString(input.view[key]);
		if (value) target.set(key, value);
	}
}
