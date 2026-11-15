/**
 * Shared pricing utilities for discount calculations.
 * Used by PDP, PLP, variant selection, cart, and other pricing-related components.
 *
 * SINGLE SOURCE OF TRUTH for all discount/sale detection logic.
 *
 * What a reduction is measured against depends on the channel (`PriceReductionReference`,
 * `src/config/pricing.ts`):
 *
 * - `"prior-price"` (channels that ship to the EU/EEA): only Saleor's **prior price**
 *   (`pricing.pricePrior`, `pricing.priceRangePrior`), the lowest price of the last 30
 *   days, which the merchant keeps in the variant's channel listing (`priorPrice`). It is
 *   not the list price: a product that was cheaper two weeks ago must not be shown as
 *   reduced from a price nobody paid recently. No prior price, no reduction: the plain
 *   price, without a strike-through, percentage or sale badge.
 * - `"list-price"` (every other channel): the prior price when set, otherwise the list
 *   price before promotions (`priceUndiscounted`).
 *
 * The rule is settled on the server and handed on as a resolved **reference price**
 * (`pickReferencePrice`, `withPriceReference`). Always per variant: a product's price
 * range and prior range can come from different variants. Everything below
 * only compares a price with its reference and never chooses between the two sources.
 */

import type { PriceReductionReference } from "@/config/pricing";

export type { PriceReductionReference };

type Money = { gross: { amount: number; currency: string } };

/** Saleor variant pricing as far as reductions go. */
type ReferencePricing<M = Money> = {
	pricePrior?: M | null;
	priceUndiscounted?: M | null;
};

/**
 * Which rule a channel follows. An explicit override wins. Otherwise a channel that ships
 * to at least one prior-price country follows `"prior-price"`. A channel without shipping
 * countries (digital goods) is judged by its default country, and with neither known the
 * stricter rule applies.
 */
export function resolvePriceReductionReference(input: {
	override?: PriceReductionReference;
	shippingCountries: ReadonlyArray<string>;
	defaultCountry?: string | null;
	priorPriceCountries: ReadonlySet<string>;
}): PriceReductionReference {
	if (input.override) {
		return input.override;
	}

	const countries =
		input.shippingCountries.length > 0
			? input.shippingCountries
			: input.defaultCountry
				? [input.defaultCountry]
				: null;
	if (!countries) {
		return "prior-price";
	}

	return countries.some((country) => input.priorPriceCountries.has(country)) ? "prior-price" : "list-price";
}

/** The price a reduction is measured against under the channel's rule. `null`: none. */
export function pickReferencePrice<M>(
	pricing: ReferencePricing<M> | null | undefined,
	reference: PriceReductionReference,
): M | null {
	if (pricing?.pricePrior) {
		return pricing.pricePrior;
	}
	return reference === "list-price" ? (pricing?.priceUndiscounted ?? null) : null;
}

/**
 * Attach the resolved `pricing.priceReference` to anything that carries Saleor variant
 * pricing (a PDP variant, a cart line's variant). Client components read only that field.
 */
export function withPriceReference<T extends { pricing?: ReferencePricing | null }>(
	item: T,
	reference: PriceReductionReference,
): T & { pricing: NonNullable<T["pricing"]> & { priceReference: Money | null } } {
	return {
		...item,
		pricing: {
			...(item.pricing as NonNullable<T["pricing"]>),
			priceReference: pickReferencePrice(item.pricing, reference),
		},
	};
}

export interface PriceInfo {
	amount?: number | null;
	currency?: string | null;
}

export interface DiscountInfo {
	isOnSale: boolean;
	discountPercent: number | null;
}

export interface PriceRange {
	start?: { gross?: { amount?: number | null } | null } | null;
	stop?: { gross?: { amount?: number | null } | null } | null;
}

/**
 * Check if a price pair represents a discount.
 * Uses typeof to handle $0 prices correctly (0 is falsy in JS).
 */
export function hasDiscount(
	currentPrice: number | null | undefined,
	referencePrice: number | null | undefined,
): boolean {
	return (
		typeof referencePrice === "number" && typeof currentPrice === "number" && referencePrice > currentPrice
	);
}

/**
 * Calculate discount percentage from price and its reference price.
 * Returns 0 if no discount or invalid prices.
 */
export function calculateDiscountPercent(
	currentPrice: number | null | undefined,
	referencePrice: number | null | undefined,
): number {
	if (!hasDiscount(currentPrice, referencePrice)) return 0;
	// TypeScript knows these are numbers after hasDiscount check
	return Math.round(((referencePrice! - currentPrice!) / referencePrice!) * 100);
}

/**
 * Get complete discount info from pricing data.
 * Useful for components that need both the flag and percentage.
 */
export function getDiscountInfo(
	currentPrice: number | null | undefined,
	referencePrice: number | null | undefined,
): DiscountInfo {
	const isOnSale = hasDiscount(currentPrice, referencePrice);
	const discountPercent = isOnSale ? calculateDiscountPercent(currentPrice, referencePrice) : null;
	return { isOnSale, discountPercent };
}

/**
 * Get max discount info across a list of items with pricing.
 * Useful for showing "up to X% off" on variant options.
 */
export function getMaxDiscountInfo<T>(
	items: T[],
	getPrices: (item: T) => { current: number | null | undefined; reference: number | null | undefined },
): DiscountInfo {
	let hasAnyDiscount = false;
	let maxPercent = 0;

	for (const item of items) {
		const { current, reference } = getPrices(item);
		if (hasDiscount(current, reference)) {
			hasAnyDiscount = true;
			const percent = calculateDiscountPercent(current, reference);
			if (percent > maxPercent) maxPercent = percent;
		}
	}

	return {
		isOnSale: hasAnyDiscount,
		discountPercent: hasAnyDiscount ? maxPercent : null,
	};
}

/**
 * @deprecated Ranges cannot tell which variant a reduction belongs to: Saleor builds the
 * prior range only from variants that have a prior price. Compare each variant with its
 * own reference price instead (`pickReferencePrice`), as listing cards do.
 *
 * Check if ANY variant in a product is on sale using price ranges.
 *
 * For PLP product cards where we only have aggregated price ranges (not per-variant pricing).
 * Checks both start (cheapest) and stop (most expensive) to catch discounts on any variant.
 *
 * @example
 * // Variant A: $50 -> $30 (on sale), Variant B: $20 -> $20 (not on sale)
 * // priceRange: { start: $20, stop: $30 }
 * // reference range: { start: $20, stop: $50 }
 * // Result: true (because stop shows a discount)
 */
export function hasDiscountInPriceRange(
	priceRange: PriceRange | null | undefined,
	referenceRange: PriceRange | null | undefined,
): boolean {
	const startPrice = priceRange?.start?.gross?.amount;
	const stopPrice = priceRange?.stop?.gross?.amount;
	const referenceStart = referenceRange?.start?.gross?.amount;
	const referenceStop = referenceRange?.stop?.gross?.amount;

	// Check if cheapest variant is on sale
	const hasStartDiscount = hasDiscount(startPrice, referenceStart);
	// Check if most expensive variant is on sale
	const hasStopDiscount = hasDiscount(stopPrice, referenceStop);

	return hasStartDiscount || hasStopDiscount;
}
