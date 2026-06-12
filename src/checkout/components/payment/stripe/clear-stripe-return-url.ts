import { updateCheckoutQuery } from "@/checkout/lib/checkout-search-params";

/** Leave the processing overlay and return to the payment step after a failed 3DS return. */
export function clearStripeReturnUrlParams(): void {
	updateCheckoutQuery({
		processingPayment: null,
		paymentIntent: null,
		paymentIntentClientSecret: null,
		redirectStatus: null,
		transaction: null,
		step: "payment",
	});
}
