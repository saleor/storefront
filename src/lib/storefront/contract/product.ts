/**
 * Paper-owned product shape for templates.
 *
 * Templates take this instead of a Saleor GraphQL result. Loaders stay on the
 * kernel; `toProductView` is the only mapper. Fork fields arrive through
 * `extensions` (`src/config/storefront-view.ts`).
 */
export interface ProductViewCategory {
	id: string;
	name: string;
	slug: string;
}

export interface ProductViewAttribute {
	name: string;
	value: string | boolean | string[];
}

export interface ProductViewImage {
	url: string;
	alt: string | null;
	/** Saleor rung `srcset`. Absent means the surface falls back to `next/image`. */
	srcSet?: string;
	thumbSrc?: string;
	thumbSrcSet?: string;
}

export interface ProductViewPriceRange {
	low: number;
	high: number;
	currency: string;
}

export interface ProductView {
	id: string;
	/** Locale slug already applied by the loader. */
	slug: string;
	name: string;
	category: ProductViewCategory | null;
	/** Sanitized HTML blocks from the product description. */
	descriptionHtml: string[] | null;
	/** Specs. Size, color, care, and bestseller flags are already removed. */
	attributes: ProductViewAttribute[];
	careInstructions: string | null;
	images: ProductViewImage[];
	priceRange: ProductViewPriceRange | null;
	isAvailable: boolean;
	isBestseller: boolean;
	variantCount: number;
	seoTitle: string | null;
	seoDescription: string | null;
	/**
	 * Fork-owned fields from `ProductDetailsExtension`.
	 * Empty unless `mapProductExtensions` returns them.
	 */
	extensions: Record<string, unknown>;
}
