import { afterEach, describe, expect, it } from "vitest";

import {
	PAYMENT_COMPLETING_STORAGE_KEY,
	PAYMENT_COMPLETION_ERROR_STORAGE_KEY,
	abortCheckoutPaymentFlow,
	beginCheckoutPaymentFlow,
	clearPaymentCompleting,
	consumePaymentCompletionError,
	isCheckoutPaymentActive,
	isCheckoutPaymentFlowStale,
	isPaymentCompleting,
	markPaymentCompleting,
	stashPaymentCompletionError,
	subscribePaymentCompleting,
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

	it("notifies subscribers when the completing flag changes", () => {
		let revision = 0;
		const unsubscribe = subscribePaymentCompleting(() => {
			revision += 1;
		});

		markPaymentCompleting("checkout-a");
		clearPaymentCompleting();
		unsubscribe();

		expect(revision).toBe(2);
	});

	it("stashes and consumes post-confirm payment errors once", () => {
		stashPaymentCompletionError("Order could not be placed.");
		expect(sessionStorage.getItem(PAYMENT_COMPLETION_ERROR_STORAGE_KEY)).toBe("Order could not be placed.");

		expect(consumePaymentCompletionError()).toBe("Order could not be placed.");
		expect(consumePaymentCompletionError()).toBeNull();
		expect(sessionStorage.getItem(PAYMENT_COMPLETION_ERROR_STORAGE_KEY)).toBeNull();
	});

	it("aborts in-flight payment work and stashes an optional error", () => {
		const flowGeneration = beginCheckoutPaymentFlow();
		markPaymentCompleting("checkout-a");

		abortCheckoutPaymentFlow("Payment was interrupted. Please try again.");

		expect(isPaymentCompleting("checkout-a")).toBe(false);
		expect(consumePaymentCompletionError()).toBe("Payment was interrupted. Please try again.");
		expect(isCheckoutPaymentFlowStale(flowGeneration)).toBe(true);
	});
});
