/**
 * Shared pricing utilities for discount calculations.
 * Used by PDP, PLP, variant selection, cart, and other pricing-related components.
 *
 * SINGLE SOURCE OF TRUTH for all discount/sale detection logic.
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
	undiscountedPrice: number | null | undefined,
): boolean {
	return (
		typeof undiscountedPrice === "number" &&
		typeof currentPrice === "number" &&
		undiscountedPrice > currentPrice
	);
}

/**
 * Calculate discount percentage from price and undiscounted price.
 * Returns 0 if no discount or invalid prices.
 */
export function calculateDiscountPercent(
	currentPrice: number | null | undefined,
	undiscountedPrice: number | null | undefined,
): number {
	if (!hasDiscount(currentPrice, undiscountedPrice)) return 0;
	// TypeScript knows these are numbers after hasDiscount check
	return Math.round(((undiscountedPrice! - currentPrice!) / undiscountedPrice!) * 100);
}

/**
 * Get complete discount info from pricing data.
 * Useful for components that need both the flag and percentage.
 */
export function getDiscountInfo(
	currentPrice: number | null | undefined,
	undiscountedPrice: number | null | undefined,
): DiscountInfo {
	const isOnSale = hasDiscount(currentPrice, undiscountedPrice);
	const discountPercent = isOnSale ? calculateDiscountPercent(currentPrice, undiscountedPrice) : null;
	return { isOnSale, discountPercent };
}

/**
 * Get max discount info across a list of items with pricing.
 * Useful for showing "up to X% off" on variant options.
 */
export function getMaxDiscountInfo<T>(
	items: T[],
	getPrices: (item: T) => { current: number | null | undefined; undiscounted: number | null | undefined },
): DiscountInfo {
	let hasAnyDiscount = false;
	let maxPercent = 0;

	for (const item of items) {
		const { current, undiscounted } = getPrices(item);
		if (hasDiscount(current, undiscounted)) {
			hasAnyDiscount = true;
			const percent = calculateDiscountPercent(current, undiscounted);
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
 * // priceRangeUndiscounted: { start: $20, stop: $50 }
 * // Result: true (because stop shows a discount)
 */
export function hasDiscountInPriceRange(
	priceRange: PriceRange | null | undefined,
	priceRangeUndiscounted: PriceRange | null | undefined,
): boolean {
	const startPrice = priceRange?.start?.gross?.amount;
	const stopPrice = priceRange?.stop?.gross?.amount;
	const undiscountedStart = priceRangeUndiscounted?.start?.gross?.amount;
	const undiscountedStop = priceRangeUndiscounted?.stop?.gross?.amount;

	// Check if cheapest variant is on sale
	const hasStartDiscount = hasDiscount(startPrice, undiscountedStart);
	// Check if most expensive variant is on sale
	const hasStopDiscount = hasDiscount(stopPrice, undiscountedStop);

	return hasStartDiscount || hasStopDiscount;
}
