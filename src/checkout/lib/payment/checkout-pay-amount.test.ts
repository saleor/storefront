import { describe, expect, it } from "vitest";

import {
	CHECKOUT_TOTAL_CHANGE_EPSILON,
	getCheckoutPayAmount,
	getCheckoutPayAmountInCents,
	hasCheckoutTotalLoadingMismatch,
	hasMaterialCheckoutTotalChange,
	isCheckoutFreeOrder,
} from "./checkout-pay-amount";

describe("getCheckoutPayAmount", () => {
	it("returns gross amount when present", () => {
		expect(getCheckoutPayAmount({ totalPrice: { gross: { amount: 42.5, currency: "USD" } } })).toBe(42.5);
	});

	it("returns null when amount is missing", () => {
		expect(getCheckoutPayAmount({ totalPrice: { gross: null } })).toBeNull();
	});
});

describe("getCheckoutPayAmountInCents", () => {
	it("returns minor units for positive totals", () => {
		expect(getCheckoutPayAmountInCents({ totalPrice: { gross: { amount: 42.5, currency: "USD" } } })).toBe(
			4250,
		);
	});

	it("returns null for zero totals", () => {
		expect(getCheckoutPayAmountInCents({ totalPrice: { gross: { amount: 0, currency: "USD" } } })).toBeNull();
	});
});

describe("isCheckoutFreeOrder", () => {
	it("is true only when gross total is exactly zero", () => {
		expect(isCheckoutFreeOrder({ totalPrice: { gross: { amount: 0, currency: "USD" } } })).toBe(true);
		expect(isCheckoutFreeOrder({ totalPrice: { gross: { amount: 1, currency: "USD" } } })).toBe(false);
	});
});

describe("hasCheckoutTotalLoadingMismatch", () => {
	it("detects zero total with positive subtotal", () => {
		expect(
			hasCheckoutTotalLoadingMismatch({
				totalPrice: { gross: { amount: 0, currency: "USD" } },
				subtotalPrice: { gross: { amount: 25, currency: "USD" } },
			}),
		).toBe(true);
	});

	it("does not treat a fully discounted order as a loading mismatch", () => {
		expect(
			hasCheckoutTotalLoadingMismatch({
				totalPrice: { gross: { amount: 0, currency: "USD" } },
				subtotalPrice: { gross: { amount: 25, currency: "USD" } },
				discount: { amount: 25, currency: "USD" },
			}),
		).toBe(false);
	});
});

describe("hasMaterialCheckoutTotalChange", () => {
	it("returns false when totals match within epsilon", () => {
		expect(hasMaterialCheckoutTotalChange(100, 100)).toBe(false);
		expect(hasMaterialCheckoutTotalChange(100, 100.009)).toBe(false);
	});

	it("returns true when totals differ beyond epsilon", () => {
		expect(hasMaterialCheckoutTotalChange(100, 110)).toBe(true);
		expect(hasMaterialCheckoutTotalChange(100, 100 + CHECKOUT_TOTAL_CHANGE_EPSILON + 0.001)).toBe(true);
	});
});
