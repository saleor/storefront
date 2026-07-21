import type { ProductListItemFragment } from "@/gql/graphql";
import type { ProductCardData } from "./product-card-data";
import { getColorHex, isColorAttribute, isSizeAttribute } from "@/lib/colors";
import { sortSizes } from "@/lib/sizes";
import { localeConfig, resolveLocaleFromSlug } from "@/config/locale";
import { calculateDiscountPercent, hasDiscount, hasDiscountInPriceRange } from "@/lib/pricing";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedName } from "@/lib/saleor-translations";
import { isBestseller } from "@/lib/catalog/product-flags";

type ListVariantNode = NonNullable<
	NonNullable<ProductListItemFragment["productVariants"]>["edges"][number]
>["node"];

function listVariantNodes(product: ProductListItemFragment): ListVariantNode[] {
	return product.productVariants?.edges.map((edge) => edge.node) ?? [];
}

/**
 * Extract colors from the capped PLP variant sample.
 */
function extractColorsFromVariants(variants: ListVariantNode[]): { name: string; hex: string }[] {
	const colorSet = new Map<string, string>();

	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isColorAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					const colorName = value.name;
					if (colorName && !colorSet.has(colorName)) {
						const hex = getColorHex(value) ?? "#6b7280"; // Default gray if no match
						colorSet.set(colorName, hex);
					}
				});
			}
		});
	});

	return Array.from(colorSet.entries()).map(([name, hex]) => ({ name, hex }));
}

/**
 * Extract sizes from the capped PLP variant sample.
 */
function extractSizesFromVariants(variants: ListVariantNode[]): string[] {
	const sizeSet = new Set<string>();

	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isSizeAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					if (value.name) {
						sizeSet.add(value.name);
					}
				});
			}
		});
	});

	// Sort sizes in logical order (S, M, L, XL or numeric)
	return sortSizes(Array.from(sizeSet));
}

/** Map a Saleor list item to {@link ProductCardData} for cards and client filters. */
export function toProductCardData(
	product: ProductListItemFragment,
	locale: string,
	channel: string,
): ProductCardData {
	const startPrice = product.pricing?.priceRange?.start?.gross;
	const stopPrice = product.pricing?.priceRange?.stop?.gross;
	const undiscountedStartPrice = product.pricing?.priceRangeUndiscounted?.start?.gross;
	const startAmount = startPrice?.amount ?? 0;
	const stopAmount = stopPrice?.amount;

	// Use centralized pricing logic to detect if ANY variant is on sale
	const isSale = hasDiscountInPriceRange(
		product.pricing?.priceRange,
		product.pricing?.priceRangeUndiscounted,
	);
	const undiscountedStartAmount = undiscountedStartPrice?.amount;
	const discountPercent =
		isSale && hasDiscount(startAmount, undiscountedStartAmount)
			? calculateDiscountPercent(startAmount, undiscountedStartAmount)
			: null;

	const variantSample = listVariantNodes(product);
	const variantTotalCount = product.productVariants?.totalCount ?? variantSample.length;
	// Extract colors and sizes from the capped sample (not exhaustive when truncated)
	const colors = extractColorsFromVariants(variantSample);
	const sizes = extractSizesFromVariants(variantSample);

	const productName = pickTranslatedName(product);
	const categoryName = product.category ? pickTranslatedName(product.category) : null;

	return {
		id: product.id,
		name: productName,
		slug: product.slug,
		brand: categoryName,
		price: startAmount,
		priceStop: stopAmount != null && stopAmount !== startAmount ? stopAmount : null,
		compareAtPrice: isSale ? undiscountedStartAmount : null,
		discountPercent,
		currency: startPrice?.currency ?? localeConfig.fallbackCurrency,
		image: product.thumbnail?.url ?? "/placeholder.svg",
		imageAlt: product.thumbnail?.alt ?? productName,
		hoverImage: null, // Would need additional media in fragment
		localeBcp47: resolveLocaleFromSlug(locale).bcp47,
		href: buildStorefrontPath(locale, channel, `/products/${product.slug}`),
		badge: isSale ? "Sale" : null,
		isBestseller: isBestseller(product),
		colors,
		sizes,
		category: product.category
			? { id: product.category.id, name: categoryName ?? product.category.name, slug: product.category.slug }
			: null,
		createdAt: product.created,
		hasVariants: variantTotalCount > 1,
	};
}

/** @deprecated Use {@link toProductCardData} */
export const transformToProductCard = toProductCardData;

/**
 * Format price with currency. Pass a BCP 47 `locale` to localize grouping/symbol placement;
 * defaults to the base locale for backward compatibility.
 */
export function formatPrice(amount: number, currency: string, locale: string = localeConfig.default): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(amount);
}
