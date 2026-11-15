import { describe, expect, it } from "vitest";

import type { ProductListItemFragment } from "@/gql/graphql";
import { toProductCardData } from "./to-card";

const money = (amount: number) => ({ gross: { amount, currency: "EUR" } });
const amount = (value: number) => ({ gross: { amount: value } });

/** One sampled variant: its price, prior price and list price. */
type VariantPrices = { price: number; prior?: number; list?: number };

function product(variants: VariantPrices[]): ProductListItemFragment {
	const prices = variants.map((variant) => variant.price);
	return {
		id: "p-1",
		name: "Fleece Jacket",
		slug: "fleece-jacket",
		created: "2026-01-01T00:00:00Z",
		pricing: {
			priceRange: { start: money(Math.min(...prices)), stop: money(Math.max(...prices)) },
		},
		thumbnail: null,
		productVariants: {
			totalCount: variants.length,
			edges: variants.map((variant, index) => ({
				node: {
					id: `v-${index}`,
					selectionAttributes: [],
					pricing: {
						price: amount(variant.price),
						pricePrior: variant.prior === undefined ? null : amount(variant.prior),
						priceUndiscounted: amount(variant.list ?? variant.price),
					},
				},
			})),
		},
		category: null,
	} as unknown as ProductListItemFragment;
}

const card = (variants: VariantPrices[], rule?: "prior-price" | "list-price") =>
	toProductCardData(product(variants), "en", "eu", rule);

describe("toProductCardData pricing (prior-price channel, the default)", () => {
	it("measures the reduction against the variant's prior price", () => {
		expect(card([{ price: 71.99, prior: 89.99 }])).toMatchObject({
			price: 71.99,
			compareAtPrice: 89.99,
			discountPercent: 20,
			badge: "Sale",
		});
	});

	it("shows no reduction when the variant has no prior price", () => {
		// A promotion without a prior price in the channel listing: the plain price only,
		// even though the list price is higher.
		expect(card([{ price: 71.99, list: 89.99 }])).toMatchObject({
			price: 71.99,
			compareAtPrice: null,
			discountPercent: null,
			badge: null,
		});
	});

	it("shows no reduction when the prior price equals the current price", () => {
		expect(card([{ price: 49.99, prior: 49.99 }])).toMatchObject({
			compareAtPrice: null,
			badge: null,
		});
	});

	it("never strikes one variant's prior price through next to another variant's price", () => {
		// Saleor's priceRangePrior here is {60, 60}: it covers only the variant that has a
		// prior price. Comparing ranges would show "20, was 60, -67%" for the cheap variant.
		expect(card([{ price: 20 }, { price: 50, prior: 60 }])).toMatchObject({
			price: 20,
			priceStop: 50,
			compareAtPrice: null,
			discountPercent: null,
			badge: "Sale",
		});
	});

	it("strikes through the cheapest variant's own prior price", () => {
		expect(
			card([
				{ price: 20, prior: 25 },
				{ price: 30, prior: 50 },
			]),
		).toMatchObject({
			price: 20,
			compareAtPrice: 25,
			discountPercent: 20,
			badge: "Sale",
		});
	});

	it("shows the smallest reduction when several variants share the card's price", () => {
		expect(
			card([
				{ price: 20, prior: 30 },
				{ price: 20, prior: 25 },
			]),
		).toMatchObject({
			compareAtPrice: 25,
			discountPercent: 20,
		});
	});
});

describe("toProductCardData pricing (list-price channel)", () => {
	it("falls back to the list price when the merchant set no prior price", () => {
		expect(card([{ price: 71.99, list: 89.99 }], "list-price")).toMatchObject({
			price: 71.99,
			compareAtPrice: 89.99,
			discountPercent: 20,
			badge: "Sale",
		});
	});

	it("still prefers the prior price when there is one", () => {
		expect(card([{ price: 71.99, prior: 79.99, list: 89.99 }], "list-price")).toMatchObject({
			compareAtPrice: 79.99,
			discountPercent: 10,
		});
	});

	it("shows no reduction without a promotion", () => {
		expect(card([{ price: 49.99 }], "list-price")).toMatchObject({
			compareAtPrice: null,
			badge: null,
		});
	});
});
