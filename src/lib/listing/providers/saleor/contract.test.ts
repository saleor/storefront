import { describe, expect, it } from "vitest";
import { createSaleorListingProvider, type SaleorTransportData } from "@/lib/listing/providers/saleor";
import { runListingProviderContract } from "@/lib/listing/testing";
import type { ListingProvider } from "@/lib/listing/provider";
import type { ListingQuery } from "@/lib/storefront/contract/listing";

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

describe("saleor listing provider", () => {
	runListingProviderContract(saleorStub(), { query: categoryQuery });

	function capture() {
		const seen: Array<Record<string, unknown>> = [];
		const provider = createSaleorListingProvider(async (input) => {
			seen.push(input.variables);
			return sliceConnection(input.variables);
		});
		return { provider, seen };
	}

	it("asks Saleor for last/before when paging backwards", async () => {
		const { provider, seen } = capture();
		await provider.load({
			...categoryQuery,
			page: { mode: "cursor", direction: "prev", cursor: "cursor-1" },
		});
		expect(seen[0]?.last).toBe(12);
		expect(seen[0]?.before).toBe("cursor-1");
		expect(seen[0]?.first).toBeUndefined();
	});

	it("searches with the top-level search argument, RANK, and the grid's facet aliases", async () => {
		const { provider, seen } = capture();
		await provider.load({
			...categoryQuery,
			surface: { kind: "search", text: "hoodie" },
			selections: { colors: ["black"] },
		});
		const variables = seen[0]!;
		expect(variables.search).toBe("hoodie");
		expect(variables.filter).toBeUndefined();
		expect(variables.sortBy).toEqual({ field: "RANK", direction: "DESC" });
		expect(JSON.stringify(variables.where)).toContain('"colour"');
	});

	it("sends no search argument outside the search surface", async () => {
		const { provider, seen } = capture();
		await provider.load(categoryQuery);
		expect(seen[0]?.search).toBeUndefined();
	});
});
