/** Maps Stripe SDK errors (including thrown IntegrationErrors) to shopper-friendly copy. */
export function formatStripePayError(error: unknown): string {
	if (!error || typeof error !== "object") {
		return "An unexpected error occurred during payment.";
	}

	const message = "message" in error ? String(error.message) : "";
	const type = "type" in error ? String(error.type) : "";

	if (message.includes("mounted Payment Element") || message.includes("Express Checkout Element")) {
		return "The payment form was reset before your card could be confirmed. Please try Pay again without refreshing the page.";
	}

	if (type === "card_error" || type === "validation_error") {
		return message || "Payment failed. Check your card details and try again.";
	}

	if (type === "IntegrationError") {
		return message || "Payment could not be confirmed. Please try Pay again.";
	}

	return message || "An unexpected error occurred during payment.";
}
