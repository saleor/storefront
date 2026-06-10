import {
	clearPaymentCompleting,
	isPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { clearStripeTransactionId } from "@/checkout/lib/payment/stripe-transaction-storage";

type ReconcileCheckoutSessionStorageOptions = {
	checkoutId: string | null;
	processingPayment: boolean;
};

/** Clears stale payment transition flags when opening a new checkout session. */
export function reconcileCheckoutSessionStorage({
	checkoutId,
	processingPayment,
}: ReconcileCheckoutSessionStorageOptions) {
	if (!checkoutId) {
		if (!processingPayment) {
			clearPaymentCompleting();
			clearStripeTransactionId();
		}
		return;
	}

	// Side effect: a completing flag for a DIFFERENT checkout is cleared here. A flag for
	// this checkout is intentionally kept — after a reload the resume flow in
	// use-stripe-return-completion verifies the interrupted attempt and either finishes
	// the order or releases the payment form. Wiping it would re-expose the pay form
	// while an authorization may already exist at the PSP (double-pay risk).
	isPaymentCompleting(checkoutId);
}
