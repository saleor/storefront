"use client";

import { useSearchParams } from "next/navigation";

import { useLiveCheckoutSearchParams } from "@/checkout/lib/checkout-search-params";
import { isCheckoutPaymentActive } from "@/checkout/lib/payment/checkout-payment-completion";
import { getOrphanedStripeTransactionId } from "@/checkout/lib/payment/stripe-transaction-storage";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";
import { StripeCheckoutReturnHandler } from "./stripe-checkout-return-handler";

/**
 * Mounted at app shell level so 3DS return completion keeps running even when
 * the checkout step UI switches to the processing screen.
 */
export function StripeCheckoutCompletionHost() {
	const { checkoutId } = useCheckoutSession();
	const searchParams = useSearchParams();
	const liveSearchParams = useLiveCheckoutSearchParams(searchParams);

	if (!checkoutId) {
		return null;
	}

	// An orphaned transaction id (no completing flag, no return params) marks an attempt a
	// reload interrupted before/around `confirmPayment` resolving — mount so the resume
	// flow can reconcile it before the shopper can pay again.
	if (!isCheckoutPaymentActive(liveSearchParams, checkoutId) && !getOrphanedStripeTransactionId()) {
		return null;
	}

	return <StripeCheckoutReturnHandler checkoutId={checkoutId} />;
}
