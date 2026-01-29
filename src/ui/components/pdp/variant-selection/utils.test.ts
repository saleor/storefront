import { describe, it, expect } from "vitest";
import {
	groupVariantsByAttributes,
	findMatchingVariant,
	getAdjustedSelections,
	getOptionsForAttribute,
	getUnavailableAttributeInfo,
} from "./utils";
import {
	tshirtVariants,
	sparseVariants,
	stockVariants,
	discountedVariants,
	singleAttributeVariants,
	nameOnlyVariants,
	nameOnlyDifferentPrices,
} from "./__fixtures__/variants";

// =============================================================================
// findMatchingVariant
// =============================================================================
describe("findMatchingVariant", () => {
	it("returns undefined when no selections made", () => {
		const result = findMatchingVariant(tshirtVariants, {});
		expect(result).toBeUndefined();
	});

	it("returns undefined when only partial selection (missing size)", () => {
		const result = findMatchingVariant(tshirtVariants, { color: "black" });
		expect(result).toBeUndefined();
	});

	it("returns undefined when only partial selection (missing color)", () => {
		const result = findMatchingVariant(tshirtVariants, { size: "m" });
		expect(result).toBeUndefined();
	});

	it("returns variant ID when all attributes selected", () => {
		const result = findMatchingVariant(tshirtVariants, { color: "black", size: "m" });
		expect(result).toBe("tshirt-black-m");
	});

	it("returns correct variant for different selections", () => {
		expect(findMatchingVariant(tshirtVariants, { color: "white", size: "l" })).toBe("tshirt-white-l");
		expect(findMatchingVariant(tshirtVariants, { color: "black", size: "s" })).toBe("tshirt-black-s");
	});

	it("returns undefined for non-existent combination in sparse matrix", () => {
		// Red only comes in S, not M or L
		const result = findMatchingVariant(sparseVariants, { color: "red", size: "m" });
		expect(result).toBeUndefined();
	});

	it("returns variant for valid combination in sparse matrix", () => {
		const result = findMatchingVariant(sparseVariants, { color: "red", size: "s" });
		expect(result).toBe("sparse-red-s");
	});

	it("works with single attribute products", () => {
		const result = findMatchingVariant(singleAttributeVariants, { color: "navy" });
		expect(result).toBe("single-navy");
	});
});

// =============================================================================
// getAdjustedSelections
// =============================================================================
describe("getAdjustedSelections", () => {
	it("adds selection to empty state", () => {
		const result = getAdjustedSelections(tshirtVariants, {}, "color", "black");
		expect(result).toEqual({ color: "black" });
	});

	it("adds second selection when compatible", () => {
		const result = getAdjustedSelections(tshirtVariants, { color: "black" }, "size", "m");
		expect(result).toEqual({ color: "black", size: "m" });
	});

	it("keeps all selections when variant exists", () => {
		const result = getAdjustedSelections(tshirtVariants, { color: "black", size: "m" }, "color", "white");
		expect(result).toEqual({ color: "white", size: "m" });
	});

	it("clears conflicting selections in sparse matrix", () => {
		// Start with Blue/L, switch to Red (which only comes in S)
		const result = getAdjustedSelections(sparseVariants, { color: "blue", size: "l" }, "color", "red");
		// Red/L doesn't exist, so size should be cleared
		expect(result).toEqual({ color: "red" });
	});

	it("clears conflicting selections when switching to incompatible size", () => {
		// Start with Red/S, switch to L (Red doesn't come in L)
		const result = getAdjustedSelections(sparseVariants, { color: "red", size: "s" }, "size", "l");
		// Red/L doesn't exist, so color should be cleared
		expect(result).toEqual({ size: "l" });
	});

	it("preserves selection when switching to compatible option", () => {
		// Blue comes in S, M, L - switching sizes should preserve color
		const result = getAdjustedSelections(sparseVariants, { color: "blue", size: "s" }, "size", "m");
		expect(result).toEqual({ color: "blue", size: "m" });
	});
});

// =============================================================================
// groupVariantsByAttributes
// =============================================================================
describe("groupVariantsByAttributes", () => {
	it("extracts unique attribute values", () => {
		const groups = groupVariantsByAttributes(tshirtVariants);

		expect(groups).toHaveLength(2);

		const colorGroup = groups.find((g) => g.slug === "color");
		const sizeGroup = groups.find((g) => g.slug === "size");

		expect(colorGroup?.options).toHaveLength(2); // Black, White
		expect(sizeGroup?.options).toHaveLength(3); // S, M, L
	});

	it("marks options as available based on stock", () => {
		const groups = groupVariantsByAttributes(stockVariants);
		const colorGroup = groups.find((g) => g.slug === "color");

		const greenOption = colorGroup?.options.find((o) => o.name === "Green");
		const yellowOption = colorGroup?.options.find((o) => o.name === "Yellow");

		// Green has at least one variant in stock (M)
		expect(greenOption?.available).toBe(true);
		// Yellow has all variants out of stock
		expect(yellowOption?.available).toBe(false);
	});

	it("detects discounts on options", () => {
		const groups = groupVariantsByAttributes(discountedVariants);
		const colorGroup = groups.find((g) => g.slug === "color");

		const purpleOption = colorGroup?.options.find((o) => o.name === "Purple");
		const orangeOption = colorGroup?.options.find((o) => o.name === "Orange");

		// Purple has one discounted variant (S)
		expect(purpleOption?.hasDiscount).toBe(true);
		expect(purpleOption?.discountPercent).toBe(20);

		// Orange has 100% discount (free)
		expect(orangeOption?.hasDiscount).toBe(true);
		expect(orangeOption?.discountPercent).toBe(100);
	});

	it("handles $0 price correctly (not treated as falsy)", () => {
		const groups = groupVariantsByAttributes(discountedVariants);
		const sizeGroup = groups.find((g) => g.slug === "size");

		const sOption = sizeGroup?.options.find((o) => o.name === "S");

		// S size has discounts (both Purple S and Orange S are discounted)
		expect(sOption?.hasDiscount).toBe(true);
	});

	it("sorts color attributes first, then size", () => {
		const groups = groupVariantsByAttributes(tshirtVariants);

		expect(groups[0]?.slug).toBe("color");
		expect(groups[1]?.slug).toBe("size");
	});
});

// =============================================================================
// getOptionsForAttribute
// =============================================================================
describe("getOptionsForAttribute", () => {
	it("marks all options as existsWithCurrentSelection when no other selections", () => {
		const groups = groupVariantsByAttributes(tshirtVariants);
		const colorOptions = getOptionsForAttribute(tshirtVariants, groups, {}, "color");

		colorOptions.forEach((opt) => {
			expect(opt.existsWithCurrentSelection).toBe(true);
		});
	});

	it("marks incompatible options in sparse matrix", () => {
		const groups = groupVariantsByAttributes(sparseVariants);

		// Select Red, then check size options
		const sizeOptions = getOptionsForAttribute(sparseVariants, groups, { color: "red" }, "size");

		const sOption = sizeOptions.find((o) => o.name === "S");
		const mOption = sizeOptions.find((o) => o.name === "M");
		const lOption = sizeOptions.find((o) => o.name === "L");

		// Red only comes in S
		expect(sOption?.existsWithCurrentSelection).toBe(true);
		expect(mOption?.existsWithCurrentSelection).toBe(false);
		expect(lOption?.existsWithCurrentSelection).toBe(false);
	});

	it("all sizes exist with Blue selection", () => {
		const groups = groupVariantsByAttributes(sparseVariants);
		const sizeOptions = getOptionsForAttribute(sparseVariants, groups, { color: "blue" }, "size");

		sizeOptions.forEach((opt) => {
			expect(opt.existsWithCurrentSelection).toBe(true);
		});
	});
});

// =============================================================================
// getUnavailableAttributeInfo (dead-end detection)
// =============================================================================
describe("getUnavailableAttributeInfo", () => {
	it("returns null when no selections", () => {
		const groups = groupVariantsByAttributes(stockVariants);
		const result = getUnavailableAttributeInfo(stockVariants, groups, {});
		expect(result).toBeNull();
	});

	it("returns null when selections have available options", () => {
		const groups = groupVariantsByAttributes(tshirtVariants);
		const result = getUnavailableAttributeInfo(tshirtVariants, groups, { color: "black" });
		expect(result).toBeNull();
	});

	it("returns null when at least one compatible option exists", () => {
		// Red only comes in S, but S is still a valid option
		const groups = groupVariantsByAttributes(sparseVariants);
		const result = getUnavailableAttributeInfo(sparseVariants, groups, { color: "red" });
		expect(result).toBeNull(); // S is still available
	});

	it("returns null when out of stock but variant exists", () => {
		// Stock issues are different from non-existence
		// Yellow/S and Yellow/M exist but are out of stock - not a dead end
		// (M is still globally available via Green/M)
		const groups = groupVariantsByAttributes(stockVariants);
		const result = getUnavailableAttributeInfo(stockVariants, groups, { color: "yellow" });
		expect(result).toBeNull();
	});

	it("detects dead-end when all options are both incompatible AND unavailable", () => {
		// Create a scenario where selection leaves no valid options:
		// - Pink only comes in XL
		// - XL is out of stock globally
		const deadEndVariants = [
			{
				id: "de-pink-xl",
				name: "Pink / XL",
				quantityAvailable: 0, // Out of stock
				selectionAttributes: [
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Pink", value: "pink" }] },
					{ attribute: { slug: "size", name: "Size" }, values: [{ name: "XL", value: "xl" }] },
				],
			},
			{
				id: "de-blue-s",
				name: "Blue / S",
				quantityAvailable: 10,
				selectionAttributes: [
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Blue", value: "blue" }] },
					{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
				],
			},
		];
		const groups = groupVariantsByAttributes(deadEndVariants);
		// Pink selected: only XL exists, and it's out of stock
		// S exists but not with Pink
		const result = getUnavailableAttributeInfo(deadEndVariants, groups, { color: "pink" });

		expect(result).not.toBeNull();
		expect(result?.slug).toBe("size");
		expect(result?.blockedBy).toBe("Pink");
	});
});

// =============================================================================
// Edge Cases
// =============================================================================
describe("edge cases", () => {
	it("handles empty variants array", () => {
		const groups = groupVariantsByAttributes([]);
		expect(groups).toEqual([]);

		const match = findMatchingVariant([], { color: "black" });
		expect(match).toBeUndefined();
	});

	it("handles variant with no attributes", () => {
		const noAttrVariants = [{ id: "v1", name: "Default", quantityAvailable: 10, selectionAttributes: [] }];
		const groups = groupVariantsByAttributes(noAttrVariants);
		expect(groups).toEqual([]);
	});

	it("returns empty groups for name-only variants (fallback case)", () => {
		// When variants have no structured attributes, groupVariantsByAttributes
		// returns empty array, triggering the VariantNameSelector fallback
		const groups = groupVariantsByAttributes(nameOnlyVariants);
		expect(groups).toEqual([]);
		// The variants still have valid data for the fallback selector:
		expect(nameOnlyVariants).toHaveLength(3);
		expect(nameOnlyVariants[0]?.name).toBe("Navy blue S");
	});

	it("returns empty groups for gift cards with different prices", () => {
		const groups = groupVariantsByAttributes(nameOnlyDifferentPrices);
		expect(groups).toEqual([]);
		// Gift cards have different prices that should be shown in fallback
		expect(nameOnlyDifferentPrices[0]?.pricing?.price?.gross.amount).toBe(25);
		expect(nameOnlyDifferentPrices[2]?.pricing?.price?.gross.amount).toBe(100);
	});

	it("handles null/undefined quantity gracefully", () => {
		const nullQtyVariants = [
			{
				id: "v1",
				name: "Test Blue",
				quantityAvailable: null,
				selectionAttributes: [
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Blue", value: "blue" }] },
				],
			},
			{
				id: "v2",
				name: "Test Red",
				quantityAvailable: 5,
				selectionAttributes: [
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Red", value: "red" }] },
				],
			},
		];
		const groups = groupVariantsByAttributes(nullQtyVariants);
		// Blue should be treated as unavailable (null quantity)
		const blueOption = groups[0]?.options.find((o) => o.name === "Blue");
		expect(blueOption?.available).toBe(false);
		// Red should be available
		const redOption = groups[0]?.options.find((o) => o.name === "Red");
		expect(redOption?.available).toBe(true);
	});
});
