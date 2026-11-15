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
	pickReferencePrice,
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

/**
 * A card's sale badge and strike-through, worked out per variant: each sampled variant is
 * compared with its own reference price under the channel's rule.
 *
 * - Badge: some variant is reduced.
 * - Strike-through and percentage: only for a reduced variant at the card's price (the
 *   cheapest), so the struck-through price and the price beside it belong to the same
 *   variant. A reduction on a dearer variant keeps the badge alone.
 *
 * Variants outside the sample (more than `PLP_VARIANT_SAMPLE`) are not considered.
 */
function cardReduction(
	variants: ReadonlyArray<ListVariantNode>,
	cardPrice: number,
	rule: PriceReductionReference,
): { isSale: boolean; compareAtPrice: number | null; discountPercent: number | null } {
	let isSale = false;
	let compareAtPrice: number | null = null;

	for (const variant of variants) {
		const price = variant.pricing?.price?.gross.amount;
		const reference = pickReferencePrice(variant.pricing, rule)?.gross.amount;
		if (price === undefined || reference === undefined || !hasDiscount(price, reference)) continue;

		isSale = true;
		// Several reduced variants at the card's price: show the smallest claim.
		if (price === cardPrice && (compareAtPrice === null || reference < compareAtPrice)) {
			compareAtPrice = reference;
		}
	}

	return {
		isSale,
		compareAtPrice,
		discountPercent: compareAtPrice !== null ? calculateDiscountPercent(cardPrice, compareAtPrice) : null,
	};
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
	const startAmount = startPrice?.amount ?? 0;
	const stopAmount = stopPrice?.amount;
	const variantSample = listVariantNodes(product);
	const { isSale, compareAtPrice, discountPercent } = cardReduction(
		variantSample,
		startAmount,
		priceReference,
	);
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
		compareAtPrice,
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
