import {
	clearPaymentCompleting,
	isPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";

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
		}
		return;
	}

	if (!isPaymentCompleting(checkoutId)) {
		return;
	}

	// Full page load with a completing flag but no Stripe return params — leftover from refresh
	// or an abandoned attempt. Clear so the payment step (or authorized recovery) can render.
	if (!processingPayment) {
		clearPaymentCompleting();
	}
}
