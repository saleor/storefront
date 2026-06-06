import { clearPendingOrderId, getPendingOrderId } from "@/checkout/lib/payment/checkout-completion-storage";
import {
	clearPaymentCompleting,
	isPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";

type ReconcileCheckoutSessionStorageOptions = {
	checkoutId: string | null;
	orderId: string | null;
	processingPayment: boolean;
};

/** Clears stale payment/order transition flags when opening a new checkout session. */
export function reconcileCheckoutSessionStorage({
	checkoutId,
	orderId,
	processingPayment,
}: ReconcileCheckoutSessionStorageOptions) {
	// Pending order navigation only applies without a checkout id in the URL.
	if (checkoutId && !orderId && getPendingOrderId()) {
		clearPendingOrderId();
	}

	if (checkoutId) {
		isPaymentCompleting(checkoutId);
		return;
	}

	if (!processingPayment && !orderId) {
		clearPaymentCompleting();
	}
}
