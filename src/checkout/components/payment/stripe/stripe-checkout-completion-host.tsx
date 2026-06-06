"use client";

import { useSearchParams } from "next/navigation";

import { isCheckoutPaymentActive } from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";
import { StripeCheckoutReturnHandler } from "./stripe-checkout-return-handler";

/**
 * Mounted at app shell level so 3DS return completion keeps running even when
 * the checkout step UI switches to the processing screen.
 */
export function StripeCheckoutCompletionHost() {
	const { checkoutId } = useCheckoutSession();
	const searchParams = useSearchParams();

	if (!checkoutId || !isCheckoutPaymentActive(searchParams, checkoutId)) {
		return null;
	}

	return <StripeCheckoutReturnHandler checkoutId={checkoutId} />;
}
