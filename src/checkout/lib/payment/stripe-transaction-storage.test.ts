import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STRIPE_TRANSACTION_STORAGE_KEY } from "./stripe-transaction-storage";

/** Orphan detection relies on module state resetting on reload — simulate with fresh imports. */
async function freshModule() {
	vi.resetModules();
	return import("./stripe-transaction-storage");
}

describe("stripe-transaction-storage", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	afterEach(() => {
		sessionStorage.clear();
	});

	it("does not report an id stored by the current page load as orphaned", async () => {
		const storage = await freshModule();
		storage.storeStripeTransactionId("txn-1");
		expect(storage.getStoredStripeTransactionId()).toBe("txn-1");
		expect(storage.getOrphanedStripeTransactionId()).toBeNull();
	});

	it("reports an id that survived a reload as orphaned", async () => {
		sessionStorage.setItem(STRIPE_TRANSACTION_STORAGE_KEY, "txn-from-previous-load");
		const storage = await freshModule();
		expect(storage.getOrphanedStripeTransactionId()).toBe("txn-from-previous-load");
	});

	it("clearing removes the id and orphan status", async () => {
		sessionStorage.setItem(STRIPE_TRANSACTION_STORAGE_KEY, "txn-from-previous-load");
		const storage = await freshModule();
		storage.clearStripeTransactionId();
		expect(storage.getStoredStripeTransactionId()).toBeNull();
		expect(storage.getOrphanedStripeTransactionId()).toBeNull();
	});

	it("isPaymentCompletingOrphaned distinguishes survived flags from same-load flags", async () => {
		vi.resetModules();
		const completionA = await import("./checkout-payment-completion");
		completionA.markPaymentCompleting("checkout-a");
		expect(completionA.isPaymentCompletingOrphaned("checkout-a")).toBe(false);

		// Simulate reload: sessionStorage persists, module ownership resets.
		vi.resetModules();
		const completionB = await import("./checkout-payment-completion");
		expect(completionB.isPaymentCompletingOrphaned("checkout-a")).toBe(true);
	});
});
