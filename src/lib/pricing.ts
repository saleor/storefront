/**
 * Shared pricing utilities for discount calculations.
 * Used by PDP, variant selection, and other pricing-related components.
 */

export interface PriceInfo {
	amount?: number | null;
	currency?: string | null;
}

export interface DiscountInfo {
	isOnSale: boolean;
	discountPercent: number | null;
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
