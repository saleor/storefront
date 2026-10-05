import type {
	ProductCardView,
	FacetView,
	SortId,
	CursorPageInfo,
	OffsetPageInfo,
} from "@/lib/storefront/contract/listing";
import type { ListingViewParams } from "./listing-view";

export type ListingSurface = "all" | "category" | "collection" | "search";

export type ListingPageInfo = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string | null;
	endCursor?: string | null;
};

export type ListingPayload = {
	products: ProductCardView[];
	pageInfo: ListingPageInfo;
	totalCount: number;
	resolvedCategories: Array<{ slug: string; id: string; name: string }>;
	facets?: FacetView[];
	sorts?: SortId[];
	page?: CursorPageInfo | OffsetPageInfo;
	totalExact?: boolean;
};

const LISTING_QUERY_KEYS = [
	"cursor",
	"direction",
	"sort",
	"price",
	"colors",
	"sizes",
	"categories",
	"query",
	"page",
] as const;

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
		!hasListingValue(params.categories) &&
		!hasListingValue(params.query) &&
		!hasListingValue(params.page)
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
		query: firstString(searchParams.get("query")),
		page: firstString(searchParams.get("page")),
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
		query: firstString(params.query),
		page: firstString(params.page),
	};
}

/** Stable key of the listing params. Ignores analytics params and key order. */
export function listingViewKey(params: ListingViewParams): string {
	const target = new URLSearchParams();
	const view = listingViewFromRecord(params);
	for (const key of LISTING_QUERY_KEYS) {
		const value = view[key];
		if (typeof value === "string" && value) target.set(key, value);
	}
	return target.toString();
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
