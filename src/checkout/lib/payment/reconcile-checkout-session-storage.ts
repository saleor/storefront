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
	if (checkoutId) {
		isPaymentCompleting(checkoutId);
		return;
	}

	if (!processingPayment) {
		clearPaymentCompleting();
	}
}
