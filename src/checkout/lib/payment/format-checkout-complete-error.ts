/**
 * Maps Saleor checkoutComplete errors to shopper-friendly copy.
 *
 * Saleor completes checkout when authorizeStatus is FULL (authorized + charged
 * amounts cover the total). Capture at fulfillment is separate.
 */
export function formatCheckoutCompleteError(error: string): string {
	if (error.includes("CHECKOUT_NOT_FULLY_PAID")) {
		return "Payment does not fully cover this order total yet. Refresh the page — if funds were authorized, use Complete order. Do not pay again until we confirm the status.";
	}

	if (error.includes("CHECKOUT_ALREADY_COMPLETED")) {
		return "This order was already placed. Check your email for confirmation.";
	}

	return error;
}
