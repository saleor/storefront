import { afterEach, describe, expect, it } from "vitest";

import {
	PAYMENT_COMPLETING_STORAGE_KEY,
	clearPaymentCompleting,
	isCheckoutPaymentActive,
	isPaymentCompleting,
	markPaymentCompleting,
} from "./checkout-payment-completion";

describe("checkout-payment-completion", () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it("stores checkout id and matches only that session", () => {
		markPaymentCompleting("checkout-a");
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBe("checkout-a");
		expect(isPaymentCompleting("checkout-a")).toBe(true);
		expect(isPaymentCompleting("checkout-b")).toBe(false);
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
	});

	it("clears stale flag on mismatch", () => {
		markPaymentCompleting("checkout-old");
		expect(isPaymentCompleting("checkout-new")).toBe(false);
		expect(isPaymentCompleting("checkout-old")).toBe(false);
	});

	it("detects processingPayment in search params", () => {
		const params = new URLSearchParams("checkout=abc&processingPayment=true");
		expect(isCheckoutPaymentActive(params, "abc")).toBe(true);
	});

	it("ignores stale completing flag for a different checkout", () => {
		markPaymentCompleting("checkout-old");
		const params = new URLSearchParams("checkout=checkout-new&step=payment");
		expect(isCheckoutPaymentActive(params, "checkout-new")).toBe(false);
	});
});
