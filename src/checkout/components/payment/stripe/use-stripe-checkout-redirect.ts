export const STRIPE_TRANSACTION_STORAGE_KEY = "stripeTransactionId";

export function storeStripeTransactionId(transactionId: string) {
	sessionStorage.setItem(STRIPE_TRANSACTION_STORAGE_KEY, transactionId);
}

export function clearStripeTransactionId() {
	sessionStorage.removeItem(STRIPE_TRANSACTION_STORAGE_KEY);
}
