import { describe, expect, it } from "vitest";
import { formatVariantSelectionSummary } from "./format-variant-selection-summary";
import type { PdpVariant } from "@/lib/catalog/get-product-data";

function variant(partial: Partial<PdpVariant> & Pick<PdpVariant, "id" | "name">): PdpVariant {
	return {
		sku: null,
		quantityAvailable: 1,
		selectionAttributes: [],
		nonSelectionAttributes: [],
		media: [],
		pricing: null,
		translation: null,
		...partial,
	} as PdpVariant;
}

describe("formatVariantSelectionSummary", () => {
	it("joins selection attributes in API order with translated value names", () => {
		const v = variant({
			id: "1",
			name: "43 / Pure blue",
			selectionAttributes: [
				{
					attribute: { slug: "shoe-size", name: "Shoe size", inputType: null, translation: null },
					values: [{ name: "43", slug: "43", value: "", translation: null, file: null }],
				},
				{
					attribute: { slug: "color", name: "Color", inputType: null, translation: null },
					values: [
						{
							name: "Pure blue",
							slug: "pure-blue",
							value: "#0000FF",
							translation: { name: "Bleu pur" },
							file: null,
						},
					],
				},
			],
		});

		expect(formatVariantSelectionSummary(v)).toBe("Shoe size: 43 · Color: Bleu pur");
	});

	it("falls back to variant name when there are no selection attributes", () => {
		expect(formatVariantSelectionSummary(variant({ id: "1", name: "Default" }))).toBe("Default");
	});
});
