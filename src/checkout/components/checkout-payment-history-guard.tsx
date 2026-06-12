"use client";

import { useEffect } from "react";

import {
	ORDER_FINALIZING_INTERRUPTED_MESSAGE,
	PAYMENT_COMPLETING_STORAGE_KEY,
	abortCheckoutPaymentFlow,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

function hasActiveCompletingFlag(checkoutId: string | null): boolean {
	try {
		const stored = sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY);
		if (!stored) {
			return false;
		}

		return !checkoutId || stored === checkoutId;
	} catch {
		return false;
	}
}

function isStripeReturnInProgress(params: URLSearchParams): boolean {
	return params.get("processingPayment") === "true";
}

/**
 * Browser Back during wallet confirm or the processing screen leaves sessionStorage
 * locked while history moves on — abort and return to the payment step.
 */
export function CheckoutPaymentHistoryGuard() {
	const { checkoutId } = useCheckoutSession();

	useEffect(() => {
		const handlePopState = () => {
			const liveParams = new URLSearchParams(window.location.search);

			if (isStripeReturnInProgress(liveParams)) {
				return;
			}

			// Completing flag means payment was already confirmed — the background
			// process/finalize keeps running, so never suggest paying again.
			if (hasActiveCompletingFlag(checkoutId)) {
				abortCheckoutPaymentFlow(ORDER_FINALIZING_INTERRUPTED_MESSAGE);
				return;
			}

			// Back out of payment while a wallet/card confirm is still in flight.
			if (liveParams.get("step") !== "payment") {
				abortCheckoutPaymentFlow();
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [checkoutId]);

	return null;
}
