import type { ProductListItemFragment } from "@/gql/graphql";
import type { ProductCardData } from "./product-card-data";
import { getColorHex, isColorAttribute, isSizeAttribute } from "@/lib/colors";
import { sortByOptionLabel } from "@/lib/sizes";
import { localeConfig, resolveLocaleFromSlug } from "@/config/locale";
import { PDP_VARIANT_CAP } from "@/config/variants";
import { normalizeFacetValueSlug } from "@/config/facets";
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

function attributeValueSlug(value: { name?: string | null; slug?: string | null }): string {
	const slug = value.slug?.trim();
	if (slug) return normalizeFacetValueSlug(slug);
	const name = value.name?.trim();
	return name ? normalizeFacetValueSlug(name) : "";
}

/**
 * Extract colors from the capped PLP variant sample.
 */
function extractColorsFromVariants(
	variants: ListVariantNode[],
): { name: string; slug: string; hex: string }[] {
	const colorSet = new Map<string, { name: string; hex: string }>();

	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isColorAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					const slug = attributeValueSlug(value);
					const colorName = value.name;
					if (!slug || !colorName || colorSet.has(slug)) return;
					const hex = getColorHex(value) ?? "#6b7280";
					colorSet.set(slug, { name: colorName, hex });
				});
			}
		});
	});

	return Array.from(colorSet.entries()).map(([slug, { name, hex }]) => ({ name, slug, hex }));
}

/**
 * Extract sizes from the capped PLP variant sample.
 */
function extractSizesFromVariants(variants: ListVariantNode[]): { name: string; slug: string }[] {
	const sizeSet = new Map<string, string>();

	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isSizeAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					const slug = attributeValueSlug(value);
					const name = value.name;
					if (!slug || !name || sizeSet.has(slug)) return;
					sizeSet.set(slug, name);
				});
			}
		});
	});

	const options = Array.from(sizeSet.entries()).map(([slug, name]) => ({ name, slug }));
	return sortByOptionLabel(options);
}

/** Map a Saleor list item to {@link ProductCardData} for cards and filters. */
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
	const variantSampleSize = variantSample.length;
	const variantTotalCount = product.productVariants?.totalCount ?? variantSampleSize;
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
		hoverImage: null,
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
		variantTotalCount,
		variantSampleSize,
		isOverVariantCap: variantTotalCount > PDP_VARIANT_CAP,
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
