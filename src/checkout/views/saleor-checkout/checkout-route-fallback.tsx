"use client";

import { isPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { getCurrentStepFromParams } from "./flow";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { PaymentCompletingScreen } from "./payment-completing-screen";

/**
 * Page-level Suspense fallback for `/checkout` — reads the live URL bar so we never
 * flash Contact during payment completion or server-action revalidation.
 */
export function CheckoutRouteFallback() {
	if (typeof window !== "undefined") {
		const params = new URLSearchParams(window.location.search);
		const checkoutId = params.get("checkout");

		if (params.get("processingPayment") === "true" || isPaymentCompleting(checkoutId)) {
			return <PaymentCompletingScreen />;
		}

		const step = getCurrentStepFromParams(params, true);
		return <CheckoutSkeleton step={step.index} isShippingRequired={true} />;
	}

	return <CheckoutSkeleton step={3} isShippingRequired={true} />;
}
