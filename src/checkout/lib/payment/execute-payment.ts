import {
	DUMMY_MISSING_FROM_CHECKOUT_MESSAGE,
	getUnsupportedGatewayMessage,
} from "@/checkout/lib/payment-gateways";
import { completeCheckoutOrder } from "./complete-order";
import { executeDummyPayment } from "./providers/dummy-pay";
import { type PaymentContext, type PaymentResult, type ResolvedPaymentProvider } from "./types";

/**
 * Runs the Saleor transaction flow for the resolved provider.
 * Add new providers here (e.g. Stripe) — each implements initialize → client SDK → process → complete.
 */
export async function executePayment(
	provider: ResolvedPaymentProvider,
	context: PaymentContext,
): Promise<PaymentResult> {
	if (context.amount === 0) {
		return completeCheckoutOrder(context.checkoutId);
	}

	switch (provider.type) {
		case "dummy":
			return executeDummyPayment(context, provider.gateway.id);
		case "stripe":
			return {
				ok: false,
				error:
					"Stripe payment is handled by the card form. Complete payment using the Stripe payment section above.",
				errorKey: "payment",
			};
		case "none":
			return {
				ok: false,
				error: "No payment gateway configured. Please contact support or configure a payment app in Saleor.",
				errorKey: "payment",
			};
		case "unsupported":
			return {
				ok: false,
				error: getUnsupportedGatewayMessage(provider.gateways),
				errorKey: "payment",
			};
		case "dummy_missing":
			return { ok: false, error: DUMMY_MISSING_FROM_CHECKOUT_MESSAGE, errorKey: "payment" };
	}
}
