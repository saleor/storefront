/**
 * Backend-neutral listing contract.
 *
 * A category page and a search page return the same `ListingResult`. Which
 * backend fills it is chosen per surface (`src/config/listing-providers.ts`).
 * `count` is optional: Saleor does not aggregate facets, search engines do.
 * Templates render either way.
 */

export const SORT_IDS = [
	"featured",
	"relevance",
	"newest",
	"price_asc",
	"price_desc",
	"bestselling",
	"name",
] as const;

export type SortId = (typeof SORT_IDS)[number];

export type ListingSurfaceKind = "all" | "category" | "collection" | "search";

export type ListingSurface =
	| { kind: "all" }
	| { kind: "category"; slug: string }
	| { kind: "collection"; slug: string }
	| { kind: "search"; text: string };

/** Cursor page (Saleor) or offset page (search engines). */
export type ListingPageRequest =
	| { mode: "cursor"; cursor?: string; direction: "next" | "prev" }
	| { mode: "offset"; number: number };

export type ListingQuery = {
	surface: ListingSurface;
	channel: string;
	locale: string;
	/** Value facets. OR within a facet, AND across facets. */
	selections: Record<string, string[]>;
	range?: Partial<Record<string, { min?: number; max?: number }>>;
	/** Undefined means the surface default (featured, collection order, or relevance). */
	sort?: SortId;
	page: ListingPageRequest;
	pageSize: number;
};

/** Normalized product shape for listing cards. */
export interface ProductCardView {
	id: string;
	name: string;
	slug: string;
	brand?: string | null;
	price: number;
	/** Upper bound when variant prices differ; omit when same as `price`. */
	priceStop?: number | null;
	compareAtPrice?: number | null;
	/** Max discount on the displayed (start) price, when on sale. */
	discountPercent?: number | null;
	currency: string;
	/** BCP 47 locale for price formatting (from the route locale at build/render time). */
	localeBcp47?: string;
	image: string;
	/** Saleor rung `srcset`; absent means the card falls back to `next/image`. */
	imageSrcSet?: string;
	imageAlt?: string;
	hoverImage?: string | null;
	href: string;
	badge?: "Sale" | "New" | null;
	isBestseller?: boolean;
	/** Color dots + facet options; `slug` is the URL / Saleor value slug. */
	colors?: { name: string; slug: string; hex: string }[];
	/** Size facet options; `slug` is the URL / Saleor value slug. */
	sizes?: { name: string; slug: string }[];
	/** Category for filtering */
	category?: { id: string; name: string; slug: string } | null;
	/** ISO date string for "newest" sorting */
	createdAt?: string | null;
	/** Whether this product has variants requiring selection (no quick add) */
	hasVariants?: boolean;
	/** Full variant count from Saleor (sample may be truncated at PLP_VARIANT_SAMPLE). */
	variantTotalCount?: number;
	/** How many variants were included in the card sample. */
	variantSampleSize?: number;
	/**
	 * True when variantTotalCount exceeds PDP_VARIANT_CAP — quick-add must not
	 * open a variant sheet; shoppers go to the PDP.
	 */
	isOverVariantCap?: boolean;
}

export type FacetControl = "swatch" | "chip" | "range" | "tree";

export type FacetValueView = {
	value: string;
	label: string;
	/** Present only when the provider declares `facetCounts`. */
	count?: number;
	selected: boolean;
	hex?: string;
};

export type FacetView = {
	id: string;
	labelKey: string;
	control: FacetControl;
	values: FacetValueView[];
};

export type CursorPageInfo = {
	mode: "cursor";
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string | null;
	endCursor?: string | null;
};

export type OffsetPageInfo = {
	mode: "offset";
	number: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type ListingResult = {
	items: ProductCardView[];
	facets: FacetView[];
	sorts: SortId[];
	page: CursorPageInfo | OffsetPageInfo;
	total: { value: number; exact: boolean };
	/** Category labels for selections that are not on this page of cards. */
	resolvedCategories?: Array<{ slug: string; id: string; name: string }>;
};
