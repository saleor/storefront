import { describe, expect, it } from "vitest";
import { fixtureListingProvider } from "@/lib/listing/providers/fixture";
import { saleorListingProvider } from "@/lib/listing/providers/saleor";
import { listingFetchMode } from "@/lib/listing/policy";
import { assertProviderSupportsSurface } from "@/lib/listing/provider";
import { listingProviderFor, resolveListingProviderId } from "@/lib/listing/registry";
import type { ListingQuery } from "@/lib/storefront/contract/listing";

function query(overrides: Partial<ListingQuery> = {}): ListingQuery {
	return {
		surface: { kind: "category", slug: "hoodies" },
		channel: "default-channel",
		locale: "en",
		selections: {},
		page: { mode: "cursor", direction: "next" },
		pageSize: 12,
		...overrides,
	};
}

describe("listing cache policy", () => {
	it("keeps search and filtered queries live", () => {
		expect(listingFetchMode(query(), saleorListingProvider)).toBe("cached-saleor");
		expect(listingFetchMode(query({ sort: "newest" }), saleorListingProvider)).toBe("cached-saleor");
		expect(listingFetchMode(query({ selections: { colors: ["blue"] } }), saleorListingProvider)).toBe("live");
		expect(
			listingFetchMode(
				query({ page: { mode: "cursor", direction: "next", cursor: "abc" } }),
				saleorListingProvider,
			),
		).toBe("live");
		expect(
			listingFetchMode(query({ surface: { kind: "search", text: "hoodie" } }), saleorListingProvider),
		).toBe("live");
		expect(listingFetchMode(query(), fixtureListingProvider)).toBe("cached-ttl");
		expect(listingFetchMode(query({ selections: { sizes: ["m"] } }), fixtureListingProvider)).toBe("live");
	});
});

describe("listing provider routing", () => {
	it("lets one surface use a different provider", () => {
		const previous = process.env.LISTING_PROVIDER_SEARCH;
		process.env.LISTING_PROVIDER_SEARCH = "fixture";
		try {
			expect(listingProviderFor("search").id).toBe("fixture");
			expect(listingProviderFor("category").id).toBe("saleor");
		} finally {
			if (previous === undefined) delete process.env.LISTING_PROVIDER_SEARCH;
			else process.env.LISTING_PROVIDER_SEARCH = previous;
		}
	});

	it("falls back when the env override is unknown", () => {
		const previous = process.env.LISTING_PROVIDER_CATEGORY;
		process.env.LISTING_PROVIDER_CATEGORY = "nope";
		try {
			expect(resolveListingProviderId("category")).toBe("saleor");
		} finally {
			if (previous === undefined) delete process.env.LISTING_PROVIDER_CATEGORY;
			else process.env.LISTING_PROVIDER_CATEGORY = previous;
		}
	});

	it("throws when a provider is assigned a surface it does not serve", () => {
		expect(() =>
			assertProviderSupportsSurface(
				{
					...fixtureListingProvider,
					capabilities: { ...fixtureListingProvider.capabilities, surfaces: ["search"] },
				},
				"category",
			),
		).toThrow(/does not serve/);
	});
});
