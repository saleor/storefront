import { describe, it, expect } from "vitest";
import {
	buildVariantSelectionIndex,
	findMatchingVariantFromIndex,
	getAdjustedSelectionsFromIndex,
	getOptionsForAttributeFromIndex,
} from "./selection-index";
import {
	findMatchingVariant,
	getAdjustedSelections,
	getOptionsForAttribute,
	groupVariantsByAttributes,
	type SaleorVariant,
} from "./utils";
import { sparseVariants, tshirtVariants } from "./__fixtures__/variants";

/** Dense color × size matrix sized near PDP_VARIANT_CAP for structural assertions. */
function buildLargeMatrix(colors: number, sizes: number): SaleorVariant[] {
	const variants: SaleorVariant[] = [];
	for (let c = 0; c < colors; c++) {
		const color = `c${c}`;
		for (let s = 0; s < sizes; s++) {
			const size = `s${s}`;
			variants.push({
				id: `v-${color}-${size}`,
				name: `${color} / ${size}`,
				quantityAvailable: (c + s) % 7 === 0 ? 0 : 3,
				selectionAttributes: [
					{ attribute: { slug: "color", name: "Color" }, values: [{ name: color, slug: color }] },
					{ attribute: { slug: "size", name: "Size" }, values: [{ name: size, slug: size }] },
				],
				pricing: {
					price: { gross: { amount: 20 + c, currency: "USD" } },
					priceUndiscounted: { gross: { amount: 20 + c, currency: "USD" } },
				},
			});
		}
	}
	return variants;
}

describe("buildVariantSelectionIndex", () => {
	it("indexes every variant for O(1) complete-match lookup", () => {
		const index = buildVariantSelectionIndex(tshirtVariants);
		expect(index.variantById.size).toBe(tshirtVariants.length);
		expect(index.variantBySelectionKey.size).toBe(tshirtVariants.length);
		expect(index.groupSlugs).toEqual(["color", "size"]);
		expect(index.implicitSelections).toEqual({});
		expect(findMatchingVariantFromIndex(index, { color: "black", size: "m" })).toBe("tshirt-black-m");
	});

	it("caches single-option implicits on the index", () => {
		const variants: SaleorVariant[] = [
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
		const index = buildVariantSelectionIndex(variants);
		expect(index.implicitSelections).toEqual({ brand: "saleor" });
		expect(findMatchingVariantFromIndex(index, { size: "m" })).toBe("hoodie-m");
	});

	it("matches public wrappers on sparse matrix behavior", () => {
		const index = buildVariantSelectionIndex(sparseVariants);
		const groups = index.groups;

		expect(findMatchingVariantFromIndex(index, { color: "red", size: "m" })).toBeUndefined();
		expect(findMatchingVariant(sparseVariants, { color: "red", size: "m" }, groups)).toBeUndefined();

		expect(getAdjustedSelectionsFromIndex(index, { color: "black", size: "m" }, "color", "red")).toEqual({
			color: "red",
		});
		expect(
			getAdjustedSelections(sparseVariants, { color: "black", size: "m" }, "color", "red", groups),
		).toEqual({
			color: "red",
		});
	});
});

describe("selection-index hot-path cost", () => {
	it("serves click-path lookups from Maps without depending on variant-list scans", () => {
		// 20 × 10 = 200 — at PDP_VARIANT_CAP
		const variants = buildLargeMatrix(20, 10);
		expect(variants.length).toBe(200);

		const index = buildVariantSelectionIndex(variants);
		expect(index.variantBySelectionKey.size).toBe(200);
		expect(index.variantsByAttrValue.get("color")?.size).toBe(20);
		expect(index.variantsByAttrValue.get("size")?.size).toBe(10);

		let matches = 0;
		for (let i = 0; i < 500; i++) {
			const color = `c${i % 20}`;
			const size = `s${i % 10}`;
			const id = findMatchingVariantFromIndex(index, { color, size });
			if (id) matches++;
			getOptionsForAttributeFromIndex(index, { color }, "size");
			getAdjustedSelectionsFromIndex(index, { color }, "size", size);
		}

		expect(matches).toBe(500);
		// Structural: each size option links only to the color cardinality (not full V)
		const sizeGroup = index.groups.find((g) => g.slug === "size");
		expect(sizeGroup?.options[0]?.variantIds?.length).toBe(20);
		expect(index.variantsByAttrValue.get("size")?.get("s0")?.size).toBe(20);
	});

	it("public API remains equivalent after index rewrite", () => {
		const variants = buildLargeMatrix(5, 4);
		const groups = groupVariantsByAttributes(variants);
		const index = buildVariantSelectionIndex(variants);

		const selections = { color: "c2", size: "s1" };
		expect(findMatchingVariant(variants, selections, groups)).toBe(
			findMatchingVariantFromIndex(index, selections),
		);
		expect(getOptionsForAttribute(variants, groups, { color: "c2" }, "size")).toEqual(
			getOptionsForAttributeFromIndex(index, { color: "c2" }, "size"),
		);
	});
});
