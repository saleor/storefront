import { afterEach, describe, expect, it } from "vitest";

import {
	PAYMENT_COMPLETING_STORAGE_KEY,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { STRIPE_TRANSACTION_STORAGE_KEY } from "@/checkout/lib/payment/stripe-transaction-storage";
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

	it("clears payment completing and stripe transaction id when checkout session is absent", () => {
		markPaymentCompleting("checkout-old");
		sessionStorage.setItem(STRIPE_TRANSACTION_STORAGE_KEY, "txn-1");
		reconcileCheckoutSessionStorage({
			checkoutId: null,
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
		expect(sessionStorage.getItem(STRIPE_TRANSACTION_STORAGE_KEY)).toBeNull();
	});

	it("keeps the completing flag for the current checkout so the resume flow can reconcile it", () => {
		markPaymentCompleting("checkout-a");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-a",
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBe("checkout-a");
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
