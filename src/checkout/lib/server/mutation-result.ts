import type { CheckoutActionResult, CheckoutFieldError } from "@/checkout/lib/checkout-action-types";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";

type MutationPayload = {
	errors: ReadonlyArray<CheckoutFieldError>;
	checkout?: ServerCheckout | null;
};

export function toCheckoutActionResult(
	payload: MutationPayload | null | undefined,
	networkError?: string,
): CheckoutActionResult {
	if (networkError) {
		return { ok: false, error: networkError };
	}

	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors.length > 0) {
		return {
			ok: false,
			fieldErrors: payload.errors.map((error) => ({
				field: error.field,
				message: error.message ?? "Invalid value",
				code: error.code,
			})),
		};
	}

	if (!payload.checkout) {
		return { ok: false, error: "Checkout not returned" };
	}

	return { ok: true, checkout: payload.checkout };
}
