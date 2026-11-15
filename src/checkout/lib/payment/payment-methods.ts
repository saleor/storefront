import type { PaymentMethodKey } from "@/lib/delivery-payment";
import { resolvePaymentProvider } from "./resolve-provider";
import { type PaymentGatewayLike } from "./types";

/**
 * What this checkout can take payment with, for the delivery and payment summary when the store
 * states no `payment.methods`. Follows the checkout's own provider choice, so it names nothing
 * the Pay step cannot process: Stripe's Payment Element always offers cards (other methods depend
 * on the Stripe account), test payment only where it is allowed, and nothing for gateways Paper
 * has no integration for.
 */
export function paymentMethodsForCheckout(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): PaymentMethodKey[] {
	const provider = resolvePaymentProvider(gateways);
	switch (provider.type) {
		case "stripe":
			return ["card"];
		case "dummy":
			return ["test"];
		default:
			return [];
	}
}
