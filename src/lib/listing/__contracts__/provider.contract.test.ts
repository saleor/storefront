import { describe, expect, it } from "vitest";
import { fixtureListingProvider } from "@/lib/listing/providers/fixture";
import { createSaleorListingProvider, type SaleorTransportData } from "@/lib/listing/providers/saleor";
import type { ListingProvider } from "@/lib/listing/provider";
import type { ListingQuery, ProductCardView } from "@/lib/storefront/contract/listing";

function cardNode(index: number) {
	return {
		id: `p-${index}`,
		name: `Product ${index}`,
		slug: `product-${index}`,
		created: "2024-01-01T00:00:00Z",
		pricing: {
			priceRange: {
				start: { gross: { amount: 10 + index, currency: "USD" } },
				stop: { gross: { amount: 10 + index, currency: "USD" } },
			},
			priceRangeUndiscounted: {
				start: { gross: { amount: 10 + index, currency: "USD" } },
				stop: { gross: { amount: 10 + index, currency: "USD" } },
			},
		},
		thumbnail: null,
		productVariants: { edges: [], totalCount: 1 },
		category: null,
	};
}

const CATALOG = Array.from({ length: 15 }, (_, index) => cardNode(index));

function sliceConnection(variables: Record<string, unknown>): SaleorTransportData {
	const first = typeof variables.first === "number" ? variables.first : undefined;
	const last = typeof variables.last === "number" ? variables.last : undefined;
	const after = typeof variables.after === "string" ? Number(variables.after) : 0;
	const before = typeof variables.before === "string" ? Number(variables.before) : CATALOG.length;
	const start = last != null ? Math.max(0, before - last) : after;
	const end = last != null ? before : start + (first ?? CATALOG.length);
	const slice = CATALOG.slice(start, end);
	const connection = {
		edges: slice.map((node) => ({ node })),
		pageInfo: {
			hasNextPage: end < CATALOG.length,
			hasPreviousPage: start > 0,
			startCursor: String(start),
			endCursor: String(end),
		},
		totalCount: CATALOG.length,
	};
	if (variables.slug === "missing") return { category: null, collection: null };
	return {
		products: connection,
		category: { products: connection },
		collection: { products: connection },
	} as unknown as SaleorTransportData;
}

function saleorStub(): ListingProvider {
	return createSaleorListingProvider(async (input) => {
		if (input.variables.channel === "boom") throw new Error("saleor down");
		return sliceConnection(input.variables);
	});
}

const categoryQuery = {
	surface: { kind: "category", slug: "hoodies" },
	channel: "default-channel",
	locale: "en",
	selections: {},
	page: { mode: "cursor", direction: "next" },
	pageSize: 12,
} satisfies ListingQuery;

async function runListingProviderContract(provider: ListingProvider, query: ListingQuery) {
	it("ignores a sort the provider did not declare", async () => {
		const result = await provider.load({ ...query, sort: "name" });
		expect(result).not.toBeNull();
		expect(result?.items.length).toBeGreaterThan(0);
	});

	it("marks selections and includes counts only when the provider says so", async () => {
		const result = await provider.load({ ...query, selections: { colors: ["blue"] } });
		expect(result).not.toBeNull();
		const colors = result?.facets.find((facet) => facet.id === "colors");
		expect(colors?.values.find((value) => value.value === "blue")?.selected).toBe(true);
		for (const facet of result?.facets ?? []) {
			for (const value of facet.values) {
				if (provider.capabilities.facetCounts) expect(typeof value.count).toBe("number");
				else expect(value.count).toBeUndefined();
			}
		}
	});

	it("returns null for an unknown slug and throws on transport failure", async () => {
		await expect(
			provider.load({ ...query, surface: { kind: "category", slug: "missing" } }),
		).resolves.toBeNull();
		await expect(provider.load({ ...query, channel: "boom" })).rejects.toThrow();
	});

	it("returns the same first page after paging forward and back", async () => {
		if (provider.capabilities.pagination === "offset") {
			const first = await provider.load({ ...query, page: { mode: "offset", number: 1 } });
			const second = await provider.load({ ...query, page: { mode: "offset", number: 2 } });
			const back = await provider.load({ ...query, page: { mode: "offset", number: 1 } });
			expect(second?.items.length).toBeGreaterThan(0);
			expect(back?.items.map((item: ProductCardView) => item.id)).toEqual(
				first?.items.map((item) => item.id),
			);
			return;
		}
		const first = await provider.load({ ...query, page: { mode: "cursor", direction: "next" } });
		const end = first?.page.mode === "cursor" ? first.page.endCursor : undefined;
		const second = await provider.load({
			...query,
			page: { mode: "cursor", direction: "next", cursor: end ?? undefined },
		});
		const start = second?.page.mode === "cursor" ? second.page.startCursor : undefined;
		const back = await provider.load({
			...query,
			page: { mode: "cursor", direction: "prev", cursor: start ?? undefined },
		});
		expect(second?.items.length).toBeGreaterThan(0);
		expect(back?.items.map((item) => item.id)).toEqual(first?.items.map((item) => item.id));
	});
}

describe("fixture listing provider", () => {
	runListingProviderContract(fixtureListingProvider, {
		...categoryQuery,
		page: { mode: "offset", number: 1 },
	});
});

describe("saleor listing provider", () => {
	runListingProviderContract(saleorStub(), categoryQuery);

	it("asks Saleor for last/before when paging backwards", async () => {
		let seen: Record<string, unknown> = {};
		const provider = createSaleorListingProvider(async (input) => {
			seen = input.variables;
			return sliceConnection(input.variables);
		});
		await provider.load({
			...categoryQuery,
			page: { mode: "cursor", direction: "prev", cursor: "cursor-1" },
		});
		expect(seen.last).toBe(12);
		expect(seen.before).toBe("cursor-1");
		expect(seen.first).toBeUndefined();
	});
});
