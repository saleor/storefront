import { buildOrderConfirmationPath } from "@paper/session-bridge";

/**
 * Navigate to order confirmation on a dedicated route (`/checkout/complete`).
 * Uses a full navigation so the confirmation page RSC tree loads with `?order=`.
 */
export function navigateToOrderConfirmation(orderId: string) {
	const path = buildOrderConfirmationPath({ orderId });
	window.location.replace(path);
}
