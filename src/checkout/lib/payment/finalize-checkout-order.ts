import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import {
	clearPaymentCompleting,
	markPaymentCompleting,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { formatCheckoutCompleteError } from "@/checkout/lib/payment/format-checkout-complete-error";
import { navigateToOrderConfirmation } from "@/checkout/lib/payment/navigate-to-order";

export type FinalizeCheckoutOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

let finalizeInFlight: Promise<FinalizeCheckoutOrderResult> | null = null;
let finalizeCheckoutId: string | null = null;

/** Converts a fully-authorized (or charged) checkout into an order and navigates to confirmation. */
export async function finalizeCheckoutOrder(
	checkoutId: string,
	_channelSlug: string,
): Promise<FinalizeCheckoutOrderResult> {
	if (finalizeInFlight && finalizeCheckoutId === checkoutId) {
		return finalizeInFlight;
	}

	const run = (async (): Promise<FinalizeCheckoutOrderResult> => {
		markPaymentCompleting(checkoutId);

		const result = await getCheckoutTransport().completeCheckout(checkoutId);

		if (!result.ok) {
			const error = formatCheckoutCompleteError(result.error);
			stashPaymentCompletionError(error);
			clearPaymentCompleting();
			return { ok: false, error };
		}

		// Client nav — see navigate-to-order.ts (server redirect would false-trigger payment errors).
		navigateToOrderConfirmation(result.orderId);

		return { ok: true, orderId: result.orderId };
	})();

	finalizeInFlight = run;
	finalizeCheckoutId = checkoutId;

	const outcome = await run;

	if (!outcome.ok && finalizeInFlight === run) {
		finalizeInFlight = null;
		finalizeCheckoutId = null;
	}

	return outcome;
}
