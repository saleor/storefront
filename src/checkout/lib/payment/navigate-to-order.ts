import { buildCheckoutPath } from "@paper/session-bridge";

import { setPendingOrderId } from "@/checkout/lib/payment/checkout-completion-storage";

/**
 * Hard navigation to order confirmation — required because checkout `loadState` is
 * set on the server from URL params; client-side router.replace does not reliably
 * switch to the order view with Cache Components enabled.
 */
export function navigateToOrderConfirmation(orderId: string) {
	setPendingOrderId(orderId);
	const path = buildCheckoutPath({ orderId });
	window.location.replace(path);
}
