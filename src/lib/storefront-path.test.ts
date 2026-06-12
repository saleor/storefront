import { describe, expect, it } from "vitest";
import {
	buildStorefrontPath,
	parseStorefrontPathname,
	replaceStorefrontChannel,
	replaceStorefrontLocale,
	stripStorefrontPrefix,
} from "./storefront-path";

describe("storefront-path", () => {
	it("builds browse paths", () => {
		expect(buildStorefrontPath("en", "uk")).toBe("/en/uk");
		expect(buildStorefrontPath("en", "uk", "/products/hoodie")).toBe("/en/uk/products/hoodie");
	});

	it("parses browse paths", () => {
		expect(parseStorefrontPathname("/en/uk/products/hoodie")).toEqual({
			locale: "en",
			channel: "uk",
			suffix: "/products/hoodie",
		});
		expect(parseStorefrontPathname("/en/uk")).toEqual({
			locale: "en",
			channel: "uk",
			suffix: "",
		});
		expect(parseStorefrontPathname("/checkout")).toBeNull();
	});

	it("swaps channel while preserving locale and suffix", () => {
		expect(replaceStorefrontChannel("/en/uk/products/hoodie", "us")).toBe("/en/us/products/hoodie");
	});

	it("swaps locale while preserving channel and suffix", () => {
		expect(replaceStorefrontLocale("/en/uk/products/hoodie", "pl")).toBe("/pl/uk/products/hoodie");
	});

	it("strips locale/channel prefix", () => {
		expect(stripStorefrontPrefix("/en/uk/products", "en", "uk")).toBe("/products");
		expect(stripStorefrontPrefix("/en/uk", "en", "uk")).toBe("/");
	});
});
