/**
 * Shared pricing utilities for discount calculations.
 * Used by PDP, PLP, variant selection, cart, and other pricing-related components.
 *
 * SINGLE SOURCE OF TRUTH for all discount/sale detection logic.
 *
 * The reference a reduction is measured against is Saleor's **prior price**
 * (`pricing.pricePrior`, `pricing.priceRangePrior`): the lowest price of the last 30 days,
 * which the merchant keeps in the variant's channel listing (`priorPrice`). It is not the
 * undiscounted list price: a product that was cheaper two weeks ago must not be shown as
 * reduced from a price nobody paid recently. No prior price, no reduction: Paper then
 * shows the plain price, without a strike-through, percentage or sale badge.
 */

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
	priorPrice: number | null | undefined,
): boolean {
	return typeof priorPrice === "number" && typeof currentPrice === "number" && priorPrice > currentPrice;
}

/**
 * Calculate discount percentage from price and prior price.
 * Returns 0 if no discount or invalid prices.
 */
export function calculateDiscountPercent(
	currentPrice: number | null | undefined,
	priorPrice: number | null | undefined,
): number {
	if (!hasDiscount(currentPrice, priorPrice)) return 0;
	// TypeScript knows these are numbers after hasDiscount check
	return Math.round(((priorPrice! - currentPrice!) / priorPrice!) * 100);
}

/**
 * Get complete discount info from pricing data.
 * Useful for components that need both the flag and percentage.
 */
export function getDiscountInfo(
	currentPrice: number | null | undefined,
	priorPrice: number | null | undefined,
): DiscountInfo {
	const isOnSale = hasDiscount(currentPrice, priorPrice);
	const discountPercent = isOnSale ? calculateDiscountPercent(currentPrice, priorPrice) : null;
	return { isOnSale, discountPercent };
}

/**
 * Get max discount info across a list of items with pricing.
 * Useful for showing "up to X% off" on variant options.
 */
export function getMaxDiscountInfo<T>(
	items: T[],
	getPrices: (item: T) => { current: number | null | undefined; prior: number | null | undefined },
): DiscountInfo {
	let hasAnyDiscount = false;
	let maxPercent = 0;

	for (const item of items) {
		const { current, prior } = getPrices(item);
		if (hasDiscount(current, prior)) {
			hasAnyDiscount = true;
			const percent = calculateDiscountPercent(current, prior);
			if (percent > maxPercent) maxPercent = percent;
		}
	}

	return {
		isOnSale: hasAnyDiscount,
		discountPercent: hasAnyDiscount ? maxPercent : null,
	};
}

/**
 * Check if ANY variant in a product is on sale using price ranges.
 *
 * For PLP product cards where we only have aggregated price ranges (not per-variant pricing).
 * Checks both start (cheapest) and stop (most expensive) to catch discounts on any variant.
 *
 * @example
 * // Variant A: $50 -> $30 (on sale), Variant B: $20 -> $20 (not on sale)
 * // priceRange: { start: $20, stop: $30 }
 * // priceRangePrior: { start: $20, stop: $50 }
 * // Result: true (because stop shows a discount)
 */
export function hasDiscountInPriceRange(
	priceRange: PriceRange | null | undefined,
	priceRangePrior: PriceRange | null | undefined,
): boolean {
	const startPrice = priceRange?.start?.gross?.amount;
	const stopPrice = priceRange?.stop?.gross?.amount;
	const priorStart = priceRangePrior?.start?.gross?.amount;
	const priorStop = priceRangePrior?.stop?.gross?.amount;

	// Check if cheapest variant is on sale
	const hasStartDiscount = hasDiscount(startPrice, priorStart);
	// Check if most expensive variant is on sale
	const hasStopDiscount = hasDiscount(stopPrice, priorStop);

	return hasStartDiscount || hasStopDiscount;
}
