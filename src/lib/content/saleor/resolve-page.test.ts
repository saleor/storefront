import { describe, expect, it } from "vitest";
import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import {
	collectStorefrontContentPageSlugs,
	indexStorefrontPagesBySlug,
	resolveStorefrontPageForType,
} from "@/lib/content/saleor/resolve-page";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

function page(slug: string, isPublished = true): StorefrontContentPageFragment {
	return {
		slug,
		isPublished,
		pageType: { slug: slug.replace(/-default-channel$/, "") },
		assignedAttributes: [],
	};
}

describe("resolveStorefrontPageForType", () => {
	it("prefers channel override over global slug", () => {
		const globalPage = page("storefront-homepage");
		const channelPage = page("storefront-homepage-default-channel");
		const bySlug = indexStorefrontPagesBySlug([globalPage, channelPage]);

		const resolved = resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.homepage, "default-channel");

		expect(resolved?.slug).toBe("storefront-homepage-default-channel");
	});

	it("falls back to global slug when channel override is missing", () => {
		const globalPage = page("storefront-homepage");
		const bySlug = indexStorefrontPagesBySlug([globalPage]);

		const resolved = resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.homepage, "default-channel");

		expect(resolved?.slug).toBe("storefront-homepage");
	});
});

describe("indexStorefrontPagesBySlug", () => {
	it("skips unpublished pages", () => {
		const bySlug = indexStorefrontPagesBySlug([page("storefront-cart", false)]);

		expect(bySlug.has("storefront-cart")).toBe(false);
	});
});

describe("collectStorefrontContentPageSlugs", () => {
	it("includes channel override and global slugs for each page type", () => {
		const slugs = collectStorefrontContentPageSlugs("default-channel");

		expect(slugs).toContain("storefront-homepage");
		expect(slugs).toContain("storefront-homepage-default-channel");
	});
});
