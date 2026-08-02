export type StripePayErrorMessages = {
	formReset: string;
	expressReset: string;
	failed: string;
	unexpectedError: string;
	validationFailed: string;
};

/** Maps Stripe SDK errors (including thrown IntegrationErrors) to shopper-friendly copy. */
export function formatStripePayError(error: unknown, messages: StripePayErrorMessages): string {
	if (!error || typeof error !== "object") {
		return messages.unexpectedError;
	}

	const message = "message" in error ? String(error.message) : "";
	const type = "type" in error ? String(error.type) : "";

	if (message.includes("mounted Payment Element")) {
		return messages.formReset;
	}

	if (message.includes("Express Checkout Element")) {
		return messages.expressReset;
	}

	if (type === "card_error" || type === "validation_error") {
		return message || messages.validationFailed;
	}

	if (type === "IntegrationError") {
		return message || messages.failed;
	}

	return message || messages.unexpectedError;
}
