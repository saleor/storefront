/**
 * Listing provider contract suite. Test-only: import it from a provider's
 * `contract.test.ts`, never from runtime code.
 *
 *   describe("algolia listing provider", () => {
 *     runListingProviderContract(createAlgoliaListingProvider(stubTransport), { query });
 *   });
 *
 * Every call goes through `normalizeListingQuery`, the same path `loadListing` uses,
 * so the suite checks what a shopper's URL actually reaches.
 */
import { expect, it } from "vitest";

import { normalizeListingQuery, type ListingProvider } from "@/lib/listing/provider";
import { SORT_IDS, type ListingQuery, type ListingResult } from "@/lib/storefront/contract/listing";

export type ListingProviderContractCase = {
	/** A first-page query the stub answers with more than one page of items. */
	query: ListingQuery;
	/** A query whose transport fails. Default: `query` on channel `boom`. */
	failing?: ListingQuery;
	/**
	 * A category or collection that does not exist. Default: `query` on category slug
	 * `missing`, when the provider serves categories. Search-only providers skip this.
	 */
	missing?: ListingQuery;
};

function ids(result: ListingResult | null): string[] {
	return result?.items.map((item) => item.id) ?? [];
}

export function runListingProviderContract(
	provider: ListingProvider,
	contractCase: ListingProviderContractCase,
) {
	const { query } = contractCase;
	const failing = contractCase.failing ?? { ...query, channel: "boom" };
	const missing =
		contractCase.missing ??
		(provider.capabilities.surfaces.includes("category")
			? { ...query, surface: { kind: "category", slug: "missing" } }
			: null);
	const load = (next: ListingQuery) => provider.load(normalizeListingQuery(provider, next));

	it("serves the surface default for a sort it did not declare", async () => {
		const declared = provider.capabilities.sorts[query.surface.kind] ?? [];
		const undeclared = SORT_IDS.find((sort) => !declared.includes(sort));
		if (!undeclared) return;
		const result = await load({ ...query, sort: undeclared });
		expect(ids(result)).toEqual(ids(await load(query)));
	});

	it("serves the first page for a page in the other pagination mode", async () => {
		const other: ListingQuery["page"] =
			provider.capabilities.pagination === "cursor"
				? { mode: "offset", number: 2 }
				: { mode: "cursor", direction: "next", cursor: "opaque" };
		const result = await load({ ...query, page: other });
		expect(ids(result)).toEqual(ids(await load(query)));
	});

	it("returns only sorts it declared for the surface", async () => {
		const result = await load(query);
		const declared = provider.capabilities.sorts[query.surface.kind] ?? [];
		for (const sort of result?.sorts ?? []) expect(declared).toContain(sort);
	});

	it("marks selections and includes counts only when the provider says so", async () => {
		const result = await load({ ...query, selections: { colors: ["blue"] } });
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
		if (missing) await expect(load(missing)).resolves.toBeNull();
		await expect(load(failing)).rejects.toThrow();
	});

	it("returns the same first page after paging forward and back", async () => {
		if (provider.capabilities.pagination === "offset") {
			const first = await load({ ...query, page: { mode: "offset", number: 1 } });
			const second = await load({ ...query, page: { mode: "offset", number: 2 } });
			const back = await load({ ...query, page: { mode: "offset", number: 1 } });
			expect(second?.items.length).toBeGreaterThan(0);
			expect(ids(back)).toEqual(ids(first));
			return;
		}
		const first = await load({ ...query, page: { mode: "cursor", direction: "next" } });
		const end = first?.page.mode === "cursor" ? first.page.endCursor : undefined;
		const second = await load({
			...query,
			page: { mode: "cursor", direction: "next", cursor: end ?? undefined },
		});
		const start = second?.page.mode === "cursor" ? second.page.startCursor : undefined;
		const back = await load({
			...query,
			page: { mode: "cursor", direction: "prev", cursor: start ?? undefined },
		});
		expect(second?.items.length).toBeGreaterThan(0);
		expect(ids(back)).toEqual(ids(first));
	});
}
