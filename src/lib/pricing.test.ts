import { describe, expect, it } from "vitest";

import { PRIOR_PRICE_COUNTRIES } from "@/config/pricing";
import {
	pickReferencePrice,
	pickReferenceRange,
	resolvePriceReductionReference,
	withPriceReference,
} from "@/lib/pricing";

const money = (amount: number) => ({ gross: { amount, currency: "EUR" } });
const range = (start: number, stop: number) => ({ start: money(start), stop: money(stop) });

describe("resolvePriceReductionReference", () => {
	const resolve = (input: {
		override?: "prior-price" | "list-price";
		shippingCountries?: string[];
		defaultCountry?: string | null;
	}) =>
		resolvePriceReductionReference({
			shippingCountries: [],
			priorPriceCountries: PRIOR_PRICE_COUNTRIES,
			...input,
		});

	it("uses the prior price for a channel that ships to the EU", () => {
		expect(resolve({ shippingCountries: ["DE", "AT", "MC"] })).toBe("prior-price");
	});

	it("uses the prior price when one EU or EEA country is among many others", () => {
		expect(resolve({ shippingCountries: ["US", "CA", "IE"] })).toBe("prior-price");
		expect(resolve({ shippingCountries: ["GB", "NO"] })).toBe("prior-price");
	});

	it("keeps the list price for a channel that ships only outside the EU and EEA", () => {
		expect(resolve({ shippingCountries: ["US", "CA"] })).toBe("list-price");
		expect(resolve({ shippingCountries: ["GB"] })).toBe("list-price");
		expect(resolve({ shippingCountries: ["CH"] })).toBe("list-price");
	});

	it("judges a channel without shipping countries by its default country", () => {
		expect(resolve({ defaultCountry: "US" })).toBe("list-price");
		expect(resolve({ defaultCountry: "PL" })).toBe("prior-price");
	});

	it("takes the stricter rule when nothing is known about the channel", () => {
		expect(resolve({})).toBe("prior-price");
	});

	it("lets the configured override win either way", () => {
		expect(resolve({ override: "list-price", shippingCountries: ["DE"] })).toBe("list-price");
		expect(resolve({ override: "prior-price", shippingCountries: ["US"] })).toBe("prior-price");
	});
});

describe("pickReferencePrice", () => {
	const pricing = { pricePrior: money(89.99), priceUndiscounted: money(99.99) };

	it("uses the prior price under either rule", () => {
		expect(pickReferencePrice(pricing, "prior-price")).toEqual(money(89.99));
		expect(pickReferencePrice(pricing, "list-price")).toEqual(money(89.99));
	});

	it("falls back to the list price only where the channel allows it", () => {
		const noPrior = { pricePrior: null, priceUndiscounted: money(99.99) };
		expect(pickReferencePrice(noPrior, "prior-price")).toBeNull();
		expect(pickReferencePrice(noPrior, "list-price")).toEqual(money(99.99));
	});

	it("has no reference without pricing", () => {
		expect(pickReferencePrice(null, "list-price")).toBeNull();
	});
});

describe("withPriceReference", () => {
	it("attaches the resolved reference and keeps the rest", () => {
		const variant = {
			id: "v1",
			pricing: { price: money(71.99), pricePrior: null, priceUndiscounted: money(89.99) },
		};

		expect(withPriceReference(variant, "list-price").pricing.priceReference).toEqual(money(89.99));
		expect(withPriceReference(variant, "prior-price").pricing.priceReference).toBeNull();
		expect(withPriceReference(variant, "prior-price")).toMatchObject({
			id: "v1",
			pricing: { price: money(71.99) },
		});
	});
});

describe("pickReferenceRange", () => {
	it("uses the prior range when Saleor has one", () => {
		const pricing = { priceRangePrior: range(89.99, 99.99), priceRangeUndiscounted: range(109.99, 119.99) };
		expect(pickReferenceRange(pricing, "list-price")).toEqual(range(89.99, 99.99));
	});

	it("falls back to the list price range only where the channel allows it", () => {
		const pricing = { priceRangePrior: null, priceRangeUndiscounted: range(109.99, 119.99) };
		expect(pickReferenceRange(pricing, "prior-price")).toBeNull();
		expect(pickReferenceRange(pricing, "list-price")).toEqual(range(109.99, 119.99));
	});
});
