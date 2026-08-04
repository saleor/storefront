import { describe, it, expect } from "vitest";
import {
	groupVariantsByAttributes,
	getInteractiveAttributeGroups,
	getImplicitSelections,
	findMatchingVariant,
	getAdjustedSelections,
	getOptionsForAttribute,
	getUnavailableAttributeInfo,
	type SaleorVariant,
} from "./utils";
import {
	tshirtVariants,
	sparseVariants,
	stockVariants,
	discountedVariants,
	singleAttributeVariants,
	nameOnlyVariants,
	nameOnlyDifferentPrices,
	audiobookVariants,
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

	it("auto-applies single-option attributes when resolving a variant", () => {
		const variants = [
			{
				id: "hoodie-m",
				name: "Hoodie / M",
				quantityAvailable: 5,
				selectionAttributes: [
					{ attribute: { slug: "brand", name: "Brand" }, values: [{ name: "Saleor" }] },
					{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M" }] },
				],
			},
			{
				id: "hoodie-l",
				name: "Hoodie / L",
				quantityAvailable: 5,
				selectionAttributes: [
					{ attribute: { slug: "brand", name: "Brand" }, values: [{ name: "Saleor" }] },
					{ attribute: { slug: "size", name: "Size" }, values: [{ name: "L" }] },
				],
			},
		];
		const groups = groupVariantsByAttributes(variants);

		expect(getInteractiveAttributeGroups(groups).map((g) => g.slug)).toEqual(["size"]);
		expect(getImplicitSelections(groups)).toEqual({ brand: "saleor" });
		expect(findMatchingVariant(variants, { size: "m" }, groups)).toBe("hoodie-m");
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

	it("keeps partial selections across attribute groups when compatible", () => {
		// 3-attribute product: picking medium then audio quality must not wipe medium
		const afterMedium = getAdjustedSelections(audiobookVariants, {}, "medium", "mp3");
		expect(afterMedium).toEqual({ medium: "mp3" });

		const afterQuality = getAdjustedSelections(audiobookVariants, afterMedium, "audio-quality", "standard");
		expect(afterQuality).toEqual({ medium: "mp3", "audio-quality": "standard" });
	});

	it("resolves a full audiobook selection to the matching variant", () => {
		const selections = {
			medium: "mp3",
			"audio-quality": "standard",
			"instant-delivery": "instant-delivery:-yes",
		};
		expect(findMatchingVariant(audiobookVariants, selections)).toBe("audiobook-mp3");
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

	it("preserves product-type attribute order (first-seen on variants), not fashion swatch-first", () => {
		const groups = groupVariantsByAttributes(tshirtVariants);

		// tshirt fixtures list color before size on each variant
		expect(groups[0]?.slug).toBe("color");
		expect(groups[1]?.slug).toBe("size");
	});

	it("does not reorder size ahead of color when the API lists size first", () => {
		const sizeThenColor: SaleorVariant[] = [
			{
				id: "shoe-1",
				name: "42 / Black",
				quantityAvailable: 1,
				selectionAttributes: [
					{ attribute: { slug: "shoe-size", name: "Shoe size" }, values: [{ name: "42" }] },
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Black", value: "#000" }] },
				],
			},
			{
				id: "shoe-2",
				name: "39 / White",
				quantityAvailable: 1,
				selectionAttributes: [
					{ attribute: { slug: "shoe-size", name: "Shoe size" }, values: [{ name: "39" }] },
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: "White", value: "#fff" }] },
				],
			},
		];

		const groups = groupVariantsByAttributes(sizeThenColor);
		expect(groups.map((g) => g.slug)).toEqual(["shoe-size", "color"]);
		expect(groups[0]?.options.map((o) => o.name)).toEqual(["39", "42"]);
	});

	it("naturally sorts numeric option values (Row 10 after Row 2)", () => {
		const rowSeat: SaleorVariant[] = [
			{
				id: "a",
				name: "Row 10",
				quantityAvailable: 1,
				selectionAttributes: [{ attribute: { slug: "row", name: "Row" }, values: [{ name: "10" }] }],
			},
			{
				id: "b",
				name: "Row 2",
				quantityAvailable: 1,
				selectionAttributes: [{ attribute: { slug: "row", name: "Row" }, values: [{ name: "2" }] }],
			},
			{
				id: "c",
				name: "Row 1",
				quantityAvailable: 1,
				selectionAttributes: [{ attribute: { slug: "row", name: "Row" }, values: [{ name: "1" }] }],
			},
		];

		const groups = groupVariantsByAttributes(rowSeat);
		expect(groups[0]?.options.map((o) => o.name)).toEqual(["1", "2", "10"]);
	});

	it("extracts hex from SWATCH color attributes", () => {
		const swatchVariants = [
			{
				id: "sneaker-39",
				name: "Sky blue / 39",
				quantityAvailable: 5,
				selectionAttributes: [
					{
						attribute: { slug: "color", name: "Color", inputType: "SWATCH" },
						values: [{ name: "Sky blue", value: "#87CEEB" }],
					},
				],
			},
		];

		const groups = groupVariantsByAttributes(swatchVariants);
		const colorGroup = groups.find((g) => g.slug === "color");

		expect(colorGroup?.options[0]?.colorHex).toBe("#87CEEB");
	});

	it("extracts image URL from SWATCH attributes (non-color slug)", () => {
		const swatchVariants = [
			{
				id: "audio-standard",
				name: "MP3 / Standard",
				quantityAvailable: 10,
				selectionAttributes: [
					{
						attribute: { slug: "audio-quality", name: "Audio quality", inputType: "SWATCH" },
						values: [
							{
								name: "Standard",
								value: "",
								file: { url: "https://example.com/waveform.svg" },
							},
						],
					},
				],
			},
			{
				id: "audio-hires",
				name: "MP3 / Hi-Res",
				quantityAvailable: 10,
				selectionAttributes: [
					{
						attribute: { slug: "audio-quality", name: "Audio quality", inputType: "SWATCH" },
						values: [
							{
								name: "Hi-Res 24-bit",
								value: "",
								file: { url: "https://example.com/hires.svg" },
							},
						],
					},
				],
			},
		];

		const groups = groupVariantsByAttributes(swatchVariants);
		const qualityGroup = groups.find((g) => g.slug === "audio-quality");

		expect(qualityGroup?.options).toHaveLength(2);
		expect(qualityGroup?.options.find((o) => o.name === "Standard")?.swatchImageUrl).toBe(
			"https://example.com/waveform.svg",
		);
		expect(qualityGroup?.options.find((o) => o.name === "Hi-Res 24-bit")?.swatchImageUrl).toBe(
			"https://example.com/hires.svg",
		);
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

	it("uses contextual discounts based on other selections", () => {
		const groups = groupVariantsByAttributes(discountedVariants);

		// Without context, Purple shows max discount across S (20%) and M (0%)
		const colorOptions = getOptionsForAttribute(discountedVariants, groups, {}, "color");
		expect(colorOptions.find((o) => o.name === "Purple")?.discountPercent).toBe(20);

		// With size M selected, Purple has no discount on that variant
		const colorWithSizeM = getOptionsForAttribute(discountedVariants, groups, { size: "m" }, "color");
		expect(colorWithSizeM.find((o) => o.name === "Purple")?.discountPercent).toBeUndefined();

		// With color Purple selected, only size S is discounted (20%), not Orange's 100%
		const sizeWithPurple = getOptionsForAttribute(discountedVariants, groups, { color: "purple" }, "size");
		expect(sizeWithPurple.find((o) => o.name === "S")?.discountPercent).toBe(20);
		expect(sizeWithPurple.find((o) => o.name === "M")?.discountPercent).toBeUndefined();
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

describe("attribute value translations", () => {
	it("uses translated labels while keeping stable selection ids", () => {
		const groups = groupVariantsByAttributes([
			{
				id: "v1",
				name: "Black S",
				quantityAvailable: 1,
				selectionAttributes: [
					{
						attribute: {
							slug: "color",
							name: "Color",
							translation: { name: "Kolor" },
						},
						values: [{ name: "black", value: "black", translation: { name: "czarny" } }],
					},
				],
			},
		]);

		expect(groups[0]?.name).toBe("Kolor");
		expect(groups[0]?.options[0]).toMatchObject({ id: "black", name: "czarny" });
	});
});
