import { describe, expect, it } from "vitest";
import { enrichMarketOptions, getCurrencySymbol } from "./market-display";

describe("enrichMarketOptions", () => {
	it("uses Saleor channel name for the market label", () => {
		expect(
			enrichMarketOptions([{ id: "1", name: "Channel PLN", slug: "channel-pln", currencyCode: "PLN" }]),
		).toEqual([
			{
				id: "1",
				name: "Channel PLN",
				slug: "channel-pln",
				currencyCode: "PLN",
				displayLabel: "Channel PLN",
				currencyHint: "PLN",
			},
		]);
	});

	it("falls back to currency code when name is empty", () => {
		expect(enrichMarketOptions([{ id: "1", name: "  ", slug: "uk", currencyCode: "GBP" }])).toEqual([
			{
				id: "1",
				name: "  ",
				slug: "uk",
				currencyCode: "GBP",
				displayLabel: "GBP",
				currencyHint: undefined,
			},
		]);
	});
});

describe("getCurrencySymbol", () => {
	it("returns a symbol for known currencies", () => {
		expect(getCurrencySymbol("GBP", "en-GB")).toBe("£");
		expect(getCurrencySymbol("USD", "en-US")).toBe("$");
	});
});
