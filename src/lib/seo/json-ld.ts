import { type WithContext, type Product } from "schema-dts";
import { seoConfig, getBaseUrl } from "./config";

/**
 * Product JSON-LD structured data builder
 *
 * Creates Schema.org Product markup for rich Google search results.
 * This helps your products appear with prices, availability, and images in search.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 *
 * @example
 * const jsonLd = buildProductJsonLd({
 *   name: product.name,
 *   description: product.seoDescription,
 *   images: product.media?.map(m => m.url),
 *   sku: variant?.sku,
 *   brand: product.brand,
 *   url: `/products/${product.slug}`,
 *   price: { amount: 29.99, currency: "USD" },
 *   inStock: true,
 * });
 *
 * // In your page:
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
 */
export function buildProductJsonLd(options: {
	name: string;
	description?: string;
	images?: string[];
	sku?: string | null;
	brand?: string | null;
	url?: string;
	/** Single variant pricing */
	price?: {
		amount: number;
		currency: string;
	} | null;
	/** Price range for products with variants */
	priceRange?: {
		lowPrice: number;
		highPrice: number;
		currency: string;
	} | null;
	inStock?: boolean;
	variantCount?: number;
}): WithContext<Product> | null {
	if (!seoConfig.enableJsonLd) {
		return null;
	}

	const {
		name,
		description,
		images,
		sku,
		brand,
		url,
		price,
		priceRange,
		inStock = true,
		variantCount,
	} = options;

	const baseUrl = getBaseUrl();
	const fullUrl = url ? `${baseUrl}${url}` : undefined;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name,
		description: description || name,
		image: images && images.length > 0 ? images : undefined,
		...(sku && { sku }),
		brand: {
			"@type": "Brand",
			name: brand || seoConfig.defaultBrand,
		},
		offers: price
			? {
					"@type": "Offer",
					url: fullUrl,
					availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
					priceCurrency: price.currency,
					price: price.amount,
					seller: {
						"@type": "Organization",
						name: seoConfig.organizationName,
					},
				}
			: priceRange
				? {
						"@type": "AggregateOffer",
						url: fullUrl,
						availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
						priceCurrency: priceRange.currency,
						lowPrice: priceRange.lowPrice,
						highPrice: priceRange.highPrice,
						offerCount: variantCount,
						seller: {
							"@type": "Organization",
							name: seoConfig.organizationName,
						},
					}
				: undefined,
	};
}

/**
 * JSON-LD Script component helper
 *
 * @example
 * <script {...jsonLdScriptProps(productJsonLd)} />
 */
export function jsonLdScriptProps(data: object | null) {
	if (!data) return null;
	return {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
	};
}
