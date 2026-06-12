export const STRIPE_TRANSACTION_STORAGE_KEY = "stripeTransactionId";

/**
 * Distinguishes "stored by the current page load" from "survived a reload".
 * An id that survived a reload is evidence of an interrupted payment attempt
 * (in-modal 3DS confirm + refresh) that must be reconciled before showing a pay form.
 */
let storedByThisPageLoad = false;

export function storeStripeTransactionId(transactionId: string) {
	try {
		sessionStorage.setItem(STRIPE_TRANSACTION_STORAGE_KEY, transactionId);
		storedByThisPageLoad = true;
	} catch {
		// ignore
	}
}

export function clearStripeTransactionId() {
	try {
		sessionStorage.removeItem(STRIPE_TRANSACTION_STORAGE_KEY);
	} catch {
		// ignore
	}
	storedByThisPageLoad = false;
}

export function getStoredStripeTransactionId(): string | null {
	try {
		return sessionStorage.getItem(STRIPE_TRANSACTION_STORAGE_KEY);
	} catch {
		return null;
	}
}

/** Transaction id left behind by a previous page load — an interrupted attempt to reconcile. */
export function getOrphanedStripeTransactionId(): string | null {
	if (storedByThisPageLoad) {
		return null;
	}

	return getStoredStripeTransactionId();
}
