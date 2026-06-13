import { describe, expect, it } from "vitest";
import { enrichMarketOptions, getCurrencySymbol, getMarketRegionLabel } from "./market-display";

describe("getMarketRegionLabel", () => {
	it("maps ISO-like channel slugs to region names", () => {
		expect(getMarketRegionLabel("uk")).toBe("United Kingdom");
		expect(getMarketRegionLabel("us")).toBe("United States");
	});

	it("title-cases multi-segment slugs", () => {
		expect(getMarketRegionLabel("eu-west")).toBe("Eu West");
	});
});

describe("enrichMarketOptions", () => {
	it("adds region labels to channel options", () => {
		expect(enrichMarketOptions([{ id: "1", slug: "uk", currencyCode: "GBP" }])).toEqual([
			{ id: "1", slug: "uk", currencyCode: "GBP", regionLabel: "United Kingdom" },
		]);
	});
});

describe("getCurrencySymbol", () => {
	it("returns a symbol for known currencies", () => {
		expect(getCurrencySymbol("GBP", "en-GB")).toBe("£");
		expect(getCurrencySymbol("USD", "en-US")).toBe("$");
	});
});
