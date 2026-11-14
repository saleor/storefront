import "server-only";

import type { ProductListItemFragment } from "@/gql/graphql";
import { getColorHex, isColorAttribute, isSizeAttribute } from "@/lib/colors";
import { sortByOptionLabel } from "@/lib/sizes";
import { localeConfig, resolveLocaleFromSlug } from "@/config/locale";
import { PDP_VARIANT_CAP } from "@/config/variants";
import { normalizeFacetValueSlug } from "@/config/facets";
import {
	calculateDiscountPercent,
	hasDiscount,
	hasDiscountInPriceRange,
	pickReferenceRange,
	type PriceReductionReference,
} from "@/lib/pricing";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedName, pickTranslatedSlug } from "@/lib/saleor-translations";
import { isBestseller } from "@/lib/catalog/product-flags";
import { buildSaleorSrcSet } from "@/lib/images";
import type { ProductCardView } from "@/lib/storefront/contract/listing";

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

function extractColorsFromVariants(
	variants: ListVariantNode[],
): { name: string; slug: string; hex: string }[] {
	const colorSet = new Map<string, { name: string; hex: string }>();
	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (!isColorAttribute(attr.attribute?.slug ?? "")) return;
			attr.values?.forEach((value) => {
				const slug = attributeValueSlug(value);
				const colorName = value.name;
				if (!slug || !colorName || colorSet.has(slug)) return;
				colorSet.set(slug, { name: colorName, hex: getColorHex(value) ?? "#6b7280" });
			});
		});
	});
	return Array.from(colorSet.entries()).map(([slug, { name, hex }]) => ({ name, slug, hex }));
}

function extractSizesFromVariants(variants: ListVariantNode[]): { name: string; slug: string }[] {
	const sizeSet = new Map<string, string>();
	variants.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (!isSizeAttribute(attr.attribute?.slug ?? "")) return;
			attr.values?.forEach((value) => {
				const slug = attributeValueSlug(value);
				const name = value.name;
				if (!slug || !name || sizeSet.has(slug)) return;
				sizeSet.set(slug, name);
			});
		});
	});
	return sortByOptionLabel(Array.from(sizeSet.entries()).map(([slug, name]) => ({ name, slug })));
}

/** Map a Saleor list item to the listing card view. */
export function toProductCardData(
	product: ProductListItemFragment,
	locale: string,
	channel: string,
	/** The channel's rule (`getPriceReductionReference`). Defaults to the stricter one. */
	priceReference: PriceReductionReference = "prior-price",
): ProductCardView {
	const startPrice = product.pricing?.priceRange?.start?.gross;
	const stopPrice = product.pricing?.priceRange?.stop?.gross;
	const referenceRange = pickReferenceRange(product.pricing, priceReference);
	const startAmount = startPrice?.amount ?? 0;
	const stopAmount = stopPrice?.amount;
	// Reductions are measured against the channel's reference range: Saleor's prior price,
	// or the list price where the channel allows it. Without a reference the card shows the
	// plain price: no badge, no strike-through.
	const isSale = hasDiscountInPriceRange(product.pricing?.priceRange, referenceRange);
	const referenceStartAmount = referenceRange?.start?.gross?.amount;
	// The card's price is the cheapest variant's, so only its own reduction is shown next
	// to it. A sale on a dearer variant keeps the badge without a strike-through.
	const startIsReduced = hasDiscount(startAmount, referenceStartAmount);
	const discountPercent = startIsReduced ? calculateDiscountPercent(startAmount, referenceStartAmount) : null;
	const variantSample = listVariantNodes(product);
	const variantSampleSize = variantSample.length;
	const variantTotalCount = product.productVariants?.totalCount ?? variantSampleSize;
	const productName = pickTranslatedName(product);
	const categoryName = product.category ? pickTranslatedName(product.category) : null;

	return {
		id: product.id,
		name: productName,
		slug: product.slug,
		brand: categoryName,
		price: startAmount,
		priceStop: stopAmount != null && stopAmount !== startAmount ? stopAmount : null,
		compareAtPrice: startIsReduced ? referenceStartAmount : null,
		discountPercent,
		currency: startPrice?.currency ?? localeConfig.fallbackCurrency,
		image: product.thumbnail?.url ?? "/placeholder.svg",
		imageSrcSet: buildSaleorSrcSet([
			{ width: 256, url: product.thumbnail256?.url },
			{ width: 512, url: product.thumbnail512?.url },
			{ width: 1024, url: product.thumbnail?.url },
		]),
		imageAlt: product.thumbnail?.alt ?? productName,
		hoverImage: null,
		localeBcp47: resolveLocaleFromSlug(locale).bcp47,
		href: buildStorefrontPath(locale, channel, `/products/${pickTranslatedSlug(product)}`),
		badge: isSale ? "Sale" : null,
		isBestseller: isBestseller(product),
		colors: extractColorsFromVariants(variantSample),
		sizes: extractSizesFromVariants(variantSample),
		category: product.category
			? {
					id: product.category.id,
					name: categoryName ?? product.category.name,
					slug: product.category.slug,
				}
			: null,
		createdAt: product.created,
		hasVariants: variantTotalCount > 1,
		variantTotalCount,
		variantSampleSize,
		isOverVariantCap: variantTotalCount > PDP_VARIANT_CAP,
	};
}
