import { describe, expect, it } from "vitest";
import { shouldShowPaymentMethodArea } from "./should-show-payment-method-area";

const freeCheckout = {
	authorizeStatus: "FULL" as const,
	totalPrice: { gross: { amount: 0, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	subtotalPrice: { gross: { amount: 10, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	discount: { amount: 10, currency: "USD" },
};

const paidAuthorizedCheckout = {
	authorizeStatus: "FULL" as const,
	totalPrice: { gross: { amount: 10, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	subtotalPrice: { gross: { amount: 10, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	discount: null,
};

const unpaidCheckout = {
	authorizeStatus: "NONE" as const,
	totalPrice: { gross: { amount: 10, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	subtotalPrice: { gross: { amount: 10, currency: "USD" }, tax: { amount: 0, currency: "USD" } },
	discount: null,
};

describe("shouldShowPaymentMethodArea", () => {
	it("hides paid checkout UI when payment is already authorized", () => {
		expect(shouldShowPaymentMethodArea(paidAuthorizedCheckout)).toBe(false);
	});

	it("keeps free-order UI visible when authorizeStatus is FULL on $0 totals", () => {
		expect(shouldShowPaymentMethodArea(freeCheckout)).toBe(true);
	});

	it("shows payment UI for unpaid checkouts", () => {
		expect(shouldShowPaymentMethodArea(unpaidCheckout)).toBe(true);
	});
});
