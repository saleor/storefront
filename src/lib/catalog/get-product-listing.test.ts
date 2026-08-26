import { describe, it, expect } from "vitest";
import { isCacheableListingView } from "./get-product-listing";

describe("isCacheableListingView", () => {
	it("admits the unfiltered first page", () => {
		expect(isCacheableListingView({})).toBe(true);
	});

	it("admits sort-only views — bounded by the number of sort options", () => {
		expect(isCacheableListingView({ sort: "price_asc" })).toBe(true);
		expect(isCacheableListingView({ sort: "newest" })).toBe(true);
	});

	it("rejects paginated views", () => {
		expect(isCacheableListingView({ cursor: "WyIxIl0=" })).toBe(false);
		expect(isCacheableListingView({ cursor: "WyIxIl0=", direction: "prev" })).toBe(false);
	});

	it("rejects filtered views — each permutation is a cache entry unlikely to be reread", () => {
		expect(isCacheableListingView({ price: "0-50" })).toBe(false);
		expect(isCacheableListingView({ colors: "blue" })).toBe(false);
		expect(isCacheableListingView({ sizes: "m" })).toBe(false);
		expect(isCacheableListingView({ categories: "shoes" })).toBe(false);
	});

	it("rejects a filtered first page even when sort is present", () => {
		expect(isCacheableListingView({ sort: "price_asc", colors: "blue" })).toBe(false);
	});
});
