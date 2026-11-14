import { describe, expect, it } from "vitest";

import type { ProductListItemFragment } from "@/gql/graphql";
import { toProductCardData } from "./to-card";

const money = (amount: number) => ({ gross: { amount, currency: "EUR" } });

function product(pricing: {
	range: [number, number];
	prior?: [number, number] | null;
	list?: [number, number];
}): ProductListItemFragment {
	return {
		id: "p-1",
		name: "Fleece Jacket",
		slug: "fleece-jacket",
		created: "2026-01-01T00:00:00Z",
		pricing: {
			priceRange: { start: money(pricing.range[0]), stop: money(pricing.range[1]) },
			priceRangePrior: pricing.prior
				? { start: money(pricing.prior[0]), stop: money(pricing.prior[1]) }
				: null,
			priceRangeUndiscounted: pricing.list
				? { start: money(pricing.list[0]), stop: money(pricing.list[1]) }
				: null,
		},
		thumbnail: null,
		productVariants: { edges: [], totalCount: 1 },
		category: null,
	} as unknown as ProductListItemFragment;
}

const card = (pricing: Parameters<typeof product>[0], reference?: "prior-price" | "list-price") =>
	toProductCardData(product(pricing), "en", "eu", reference);

describe("toProductCardData pricing (prior-price channel, the default)", () => {
	it("measures the reduction against Saleor's prior price", () => {
		expect(card({ range: [71.99, 71.99], prior: [89.99, 89.99] })).toMatchObject({
			price: 71.99,
			compareAtPrice: 89.99,
			discountPercent: 20,
			badge: "Sale",
		});
	});

	it("shows no reduction when the product has no prior price", () => {
		// A promotion without a prior price in the channel listing: the plain price only,
		// even though the list price is higher.
		expect(card({ range: [71.99, 71.99], prior: null, list: [89.99, 89.99] })).toMatchObject({
			price: 71.99,
			compareAtPrice: null,
			discountPercent: null,
			badge: null,
		});
	});

	it("shows no reduction when the prior price equals the current price", () => {
		expect(card({ range: [49.99, 49.99], prior: [49.99, 49.99] })).toMatchObject({
			compareAtPrice: null,
			discountPercent: null,
			badge: null,
		});
	});

	it("keeps the badge but no strike-through when only a dearer variant is reduced", () => {
		// Cheapest variant 20 (not reduced), dearest 30 reduced from 50. The card's price is
		// the cheapest variant's: striking 20 through next to "from 20" would be wrong.
		expect(card({ range: [20, 30], prior: [20, 50] })).toMatchObject({
			price: 20,
			priceStop: 30,
			compareAtPrice: null,
			discountPercent: null,
			badge: "Sale",
		});
	});
});

describe("toProductCardData pricing (list-price channel)", () => {
	it("falls back to the list price when the merchant set no prior price", () => {
		expect(card({ range: [71.99, 71.99], prior: null, list: [89.99, 89.99] }, "list-price")).toMatchObject({
			price: 71.99,
			compareAtPrice: 89.99,
			discountPercent: 20,
			badge: "Sale",
		});
	});

	it("still prefers the prior price when there is one", () => {
		expect(
			card({ range: [71.99, 71.99], prior: [79.99, 79.99], list: [89.99, 89.99] }, "list-price"),
		).toMatchObject({ compareAtPrice: 79.99, discountPercent: 10 });
	});

	it("shows no reduction without a promotion", () => {
		expect(card({ range: [49.99, 49.99], prior: null, list: [49.99, 49.99] }, "list-price")).toMatchObject({
			compareAtPrice: null,
			badge: null,
		});
	});
});
