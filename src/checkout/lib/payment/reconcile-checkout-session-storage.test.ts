import { afterEach, describe, expect, it } from "vitest";

import {
	PENDING_ORDER_STORAGE_KEY,
	setPendingOrderId,
} from "@/checkout/lib/payment/checkout-completion-storage";
import {
	PAYMENT_COMPLETING_STORAGE_KEY,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { reconcileCheckoutSessionStorage } from "./reconcile-checkout-session-storage";

describe("reconcileCheckoutSessionStorage", () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it("clears pending order when opening a new checkout", () => {
		setPendingOrderId("order-1");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-new",
			orderId: null,
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PENDING_ORDER_STORAGE_KEY)).toBeNull();
	});

	it("clears stale payment completing flag for a different checkout", () => {
		markPaymentCompleting("checkout-old");
		reconcileCheckoutSessionStorage({
			checkoutId: "checkout-new",
			orderId: null,
			processingPayment: false,
		});
		expect(sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY)).toBeNull();
	});
});
