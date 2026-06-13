/** Normalized product shape for PLP cards and client-side filters. */
export interface ProductCardData {
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
	imageAlt?: string;
	hoverImage?: string | null;
	href: string;
	badge?: "Sale" | "New" | null;
	colors?: { name: string; hex: string }[];
	/** Available sizes for filtering (e.g., ["S", "M", "L"]) */
	sizes?: string[];
	/** Category for filtering */
	category?: { id: string; name: string; slug: string } | null;
	/** ISO date string for "newest" sorting */
	createdAt?: string | null;
	/** Whether this product has variants requiring selection (no quick add) */
	hasVariants?: boolean;
}
