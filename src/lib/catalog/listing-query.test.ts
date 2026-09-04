import { describe, expect, it } from "vitest";
import {
	applyListingSearchParams,
	isCanonicalListingView,
	listingViewFromSearchParams,
} from "./listing-query";

describe("isCanonicalListingView", () => {
	it("admits an empty query — the HTML the listing page already rendered", () => {
		expect(isCanonicalListingView({})).toBe(true);
	});

	it("rejects sort, cursor, and filters — those are not in the cached page HTML", () => {
		expect(isCanonicalListingView({ sort: "price_asc" })).toBe(false);
		expect(isCanonicalListingView({ cursor: "WyIxIl0=" })).toBe(false);
		expect(isCanonicalListingView({ colors: "blue" })).toBe(false);
		expect(isCanonicalListingView({ categories: "shoes" })).toBe(false);
	});

	it("treats empty strings as absent", () => {
		expect(isCanonicalListingView({ sort: "", colors: "" })).toBe(true);
	});
});

describe("listingViewFromSearchParams", () => {
	it("reads the listing keys and ignores others", () => {
		const params = new URLSearchParams("colors=blue&utm_source=x&sort=newest");
		expect(listingViewFromSearchParams(params)).toEqual({
			cursor: undefined,
			direction: undefined,
			sort: "newest",
			price: undefined,
			colors: "blue",
			sizes: undefined,
			categories: undefined,
		});
	});
});

describe("applyListingSearchParams", () => {
	it("writes identity and view keys", () => {
		const target = new URLSearchParams();
		applyListingSearchParams(target, {
			surface: "category",
			locale: "en",
			channel: "default-channel",
			slug: "shoes",
			view: { colors: "blue" },
		});
		expect(target.get("surface")).toBe("category");
		expect(target.get("slug")).toBe("shoes");
		expect(target.get("colors")).toBe("blue");
		expect(target.get("sort")).toBeNull();
	});
});
