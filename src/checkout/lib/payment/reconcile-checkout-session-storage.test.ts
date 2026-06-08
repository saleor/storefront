import { afterEach, describe, expect, it } from "vitest";

import {
	PAYMENT_COMPLETING_STORAGE_KEY,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { reconcileCheckoutSessionStorage } from "./reconcile-checkout-session-storage";

describe("reconcileCheckoutSessionStorage", () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it("clears stale payment completing flag for a different checkout", () => {
		markPaymentCompleting("checkout-old");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-new",
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
	});

	it("clears payment completing when checkout session is absent", () => {
		markPaymentCompleting("checkout-old");
		reconcileCheckoutSessionStorage({
			checkoutId: null,
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
	});

	it("clears stale completing flag on reload without Stripe return params", () => {
		markPaymentCompleting("checkout-a");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-a",
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
	});

	it("keeps completing flag during Stripe redirect return", () => {
		markPaymentCompleting("checkout-a");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-a",
			processingPayment: true,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBe("checkout-a");
	});
});
