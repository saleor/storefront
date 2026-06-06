import { describe, expect, it } from "vitest";

import {
	CHECKOUT_TOTAL_CHANGE_EPSILON,
	hasMaterialCheckoutTotalChange,
	getCheckoutPayAmount,
} from "./checkout-pay-amount";

describe("getCheckoutPayAmount", () => {
	it("returns gross amount when present", () => {
		expect(getCheckoutPayAmount({ totalPrice: { gross: { amount: 42.5, currency: "USD" } } })).toBe(42.5);
	});

	it("returns null when amount is missing", () => {
		expect(getCheckoutPayAmount({ totalPrice: { gross: null } })).toBeNull();
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
