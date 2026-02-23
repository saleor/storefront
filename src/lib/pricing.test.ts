import { describe, it, expect } from "vitest";
import {
	hasDiscount,
	calculateDiscountPercent,
	getDiscountInfo,
	getMaxDiscountInfo,
	hasDiscountInPriceRange,
} from "./pricing";

// =============================================================================
// hasDiscount
// =============================================================================
describe("hasDiscount", () => {
	it("returns true when undiscounted price is higher than current", () => {
		expect(hasDiscount(20, 30)).toBe(true);
	});

	it("returns false when prices are equal", () => {
		expect(hasDiscount(30, 30)).toBe(false);
	});

	it("returns false when current price is higher (markup, not discount)", () => {
		expect(hasDiscount(40, 30)).toBe(false);
	});

	it("handles $0 current price correctly (100% discount)", () => {
		expect(hasDiscount(0, 50)).toBe(true);
	});

	it("returns false when both prices are $0", () => {
		expect(hasDiscount(0, 0)).toBe(false);
	});

	it("returns false when undiscounted is $0 and current is $0", () => {
		expect(hasDiscount(0, 0)).toBe(false);
	});

	it("returns false when current price is null", () => {
		expect(hasDiscount(null, 50)).toBe(false);
	});

	it("returns false when undiscounted price is null", () => {
		expect(hasDiscount(20, null)).toBe(false);
	});

	it("returns false when both prices are null", () => {
		expect(hasDiscount(null, null)).toBe(false);
	});

	it("returns false when current price is undefined", () => {
		expect(hasDiscount(undefined, 50)).toBe(false);
	});

	it("returns false when undiscounted price is undefined", () => {
		expect(hasDiscount(20, undefined)).toBe(false);
	});

	it("works with fractional prices", () => {
		expect(hasDiscount(29.99, 49.99)).toBe(true);
	});
});

// =============================================================================
// calculateDiscountPercent
// =============================================================================
describe("calculateDiscountPercent", () => {
	it("calculates 50% discount correctly", () => {
		expect(calculateDiscountPercent(50, 100)).toBe(50);
	});

	it("calculates 100% discount (free item)", () => {
		expect(calculateDiscountPercent(0, 50)).toBe(100);
	});

	it("rounds to nearest integer", () => {
		// 10/30 = 33.333...%
		expect(calculateDiscountPercent(20, 30)).toBe(33);
	});

	it("rounds 66.666% to 67%", () => {
		// 20/30 = 66.666...%
		expect(calculateDiscountPercent(10, 30)).toBe(67);
	});

	it("handles small discount (1%)", () => {
		expect(calculateDiscountPercent(99, 100)).toBe(1);
	});

	it("returns 0 when no discount (equal prices)", () => {
		expect(calculateDiscountPercent(50, 50)).toBe(0);
	});

	it("returns 0 when current is higher than undiscounted", () => {
		expect(calculateDiscountPercent(60, 50)).toBe(0);
	});

	it("returns 0 for null prices", () => {
		expect(calculateDiscountPercent(null, 100)).toBe(0);
		expect(calculateDiscountPercent(50, null)).toBe(0);
		expect(calculateDiscountPercent(null, null)).toBe(0);
	});

	it("returns 0 for undefined prices", () => {
		expect(calculateDiscountPercent(undefined, 100)).toBe(0);
	});

	it("handles fractional prices", () => {
		// $29.99 from $49.99 = ~40%
		expect(calculateDiscountPercent(29.99, 49.99)).toBe(40);
	});
});

// =============================================================================
// getDiscountInfo
// =============================================================================
describe("getDiscountInfo", () => {
	it("returns sale info when discounted", () => {
		const info = getDiscountInfo(25, 50);
		expect(info).toEqual({ isOnSale: true, discountPercent: 50 });
	});

	it("returns no sale when prices are equal", () => {
		const info = getDiscountInfo(50, 50);
		expect(info).toEqual({ isOnSale: false, discountPercent: null });
	});

	it("returns no sale for null prices", () => {
		const info = getDiscountInfo(null, null);
		expect(info).toEqual({ isOnSale: false, discountPercent: null });
	});

	it("discountPercent is null (not 0) when no sale", () => {
		const info = getDiscountInfo(50, 50);
		expect(info.discountPercent).toBeNull();
	});

	it("handles 100% discount", () => {
		const info = getDiscountInfo(0, 100);
		expect(info).toEqual({ isOnSale: true, discountPercent: 100 });
	});
});

// =============================================================================
// getMaxDiscountInfo
// =============================================================================
describe("getMaxDiscountInfo", () => {
	it("finds the maximum discount across items", () => {
		const items = [
			{ price: 80, original: 100 }, // 20% off
			{ price: 30, original: 100 }, // 70% off
			{ price: 50, original: 100 }, // 50% off
		];
		const result = getMaxDiscountInfo(items, (item) => ({
			current: item.price,
			undiscounted: item.original,
		}));
		expect(result).toEqual({ isOnSale: true, discountPercent: 70 });
	});

	it("returns no sale when no items are discounted", () => {
		const items = [
			{ price: 100, original: 100 },
			{ price: 50, original: 50 },
		];
		const result = getMaxDiscountInfo(items, (item) => ({
			current: item.price,
			undiscounted: item.original,
		}));
		expect(result).toEqual({ isOnSale: false, discountPercent: null });
	});

	it("handles empty array", () => {
		const result = getMaxDiscountInfo([], () => ({
			current: 0,
			undiscounted: 0,
		}));
		expect(result).toEqual({ isOnSale: false, discountPercent: null });
	});

	it("ignores items with null prices in the mix", () => {
		const items = [
			{ price: 50 as number | null, original: 100 as number | null }, // 50% off
			{ price: null, original: 100 }, // invalid
			{ price: 30, original: null }, // invalid
		];
		const result = getMaxDiscountInfo(items, (item) => ({
			current: item.price,
			undiscounted: item.original,
		}));
		expect(result).toEqual({ isOnSale: true, discountPercent: 50 });
	});

	it("works with single item", () => {
		const items = [{ price: 25, original: 50 }];
		const result = getMaxDiscountInfo(items, (item) => ({
			current: item.price,
			undiscounted: item.original,
		}));
		expect(result).toEqual({ isOnSale: true, discountPercent: 50 });
	});
});

// =============================================================================
// hasDiscountInPriceRange
// =============================================================================
describe("hasDiscountInPriceRange", () => {
	const makeRange = (start: number | null, stop: number | null) => ({
		start: start != null ? { gross: { amount: start } } : null,
		stop: stop != null ? { gross: { amount: stop } } : null,
	});

	it("returns true when start price is discounted", () => {
		const current = makeRange(20, 50);
		const undiscounted = makeRange(40, 50);
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(true);
	});

	it("returns true when stop price is discounted", () => {
		const current = makeRange(20, 30);
		const undiscounted = makeRange(20, 50);
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(true);
	});

	it("returns true when both start and stop are discounted", () => {
		const current = makeRange(15, 30);
		const undiscounted = makeRange(25, 50);
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(true);
	});

	it("returns false when no discount on either end", () => {
		const current = makeRange(20, 50);
		const undiscounted = makeRange(20, 50);
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(false);
	});

	it("returns false for null price ranges", () => {
		expect(hasDiscountInPriceRange(null, null)).toBe(false);
	});

	it("returns false for undefined price ranges", () => {
		expect(hasDiscountInPriceRange(undefined, undefined)).toBe(false);
	});

	it("returns false when current range is null", () => {
		const undiscounted = makeRange(20, 50);
		expect(hasDiscountInPriceRange(null, undiscounted)).toBe(false);
	});

	it("handles $0 start price correctly (100% discount on cheapest)", () => {
		const current = makeRange(0, 50);
		const undiscounted = makeRange(25, 50);
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(true);
	});

	it("handles partial range data (only start)", () => {
		const current = { start: { gross: { amount: 20 } }, stop: null };
		const undiscounted = { start: { gross: { amount: 40 } }, stop: null };
		expect(hasDiscountInPriceRange(current, undiscounted)).toBe(true);
	});
});
