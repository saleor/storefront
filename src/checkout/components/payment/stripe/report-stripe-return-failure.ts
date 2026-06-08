import {
	clearPaymentCompleting,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";

import { clearStripeReturnUrlParams } from "./clear-stripe-return-url";
import { clearStripeTransactionId } from "./use-stripe-checkout-redirect";

/** Exit the processing screen and hand the message to the payment step for inline display. */
export function reportStripeReturnFailure(message: string, onError: (message: string) => void): void {
	clearStripeReturnUrlParams();
	stashPaymentCompletionError(message);
	clearPaymentCompleting();
	clearStripeTransactionId();
	onError(message);
}
