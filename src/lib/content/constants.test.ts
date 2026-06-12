import { describe, expect, it } from "vitest";
import {
	isStorefrontContentPageSlug,
	resolveStorefrontContentChannelsForPageSlug,
	storefrontContentPageSlugCandidates,
} from "@/lib/content/constants";

describe("storefront content slug helpers", () => {
	it("builds channel override before global slug", () => {
		expect(storefrontContentPageSlugCandidates("storefront-chrome", "us")).toEqual([
			"storefront-chrome-us",
			"storefront-chrome",
		]);
	});

	it("detects storefront page slugs", () => {
		expect(isStorefrontContentPageSlug("storefront-homepage")).toBe(true);
		expect(isStorefrontContentPageSlug("storefront-homepage-us")).toBe(true);
		expect(isStorefrontContentPageSlug("about-us")).toBe(false);
	});

	it("resolves channels for revalidation", () => {
		expect(resolveStorefrontContentChannelsForPageSlug("storefront-cart", ["us", "uk"])).toEqual([
			"us",
			"uk",
		]);
		expect(resolveStorefrontContentChannelsForPageSlug("storefront-cart-us", ["us", "uk"])).toEqual(["us"]);
	});
});
