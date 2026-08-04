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
