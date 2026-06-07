"use client";

import { isPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { getCurrentStepFromParams } from "./flow";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { PaymentCompletingScreen } from "./payment-completing-screen";

/**
 * Suspense fallback for checkout routes — reads the live URL bar so we never
 * flash "Step 1" during payment completion.
 */
export function CheckoutLoadingFallback() {
	if (typeof window !== "undefined") {
		const params = new URLSearchParams(window.location.search);
		const checkoutId = params.get("checkout");

		if (params.get("processingPayment") === "true" || isPaymentCompleting(checkoutId)) {
			return <PaymentCompletingScreen />;
		}

		const step = getCurrentStepFromParams(params, true);
		return <CheckoutSkeleton step={step.index} isShippingRequired={true} />;
	}

	// SSR (rare for this client fallback) — payment step, not step 1.
	return <CheckoutSkeleton step={3} isShippingRequired={true} />;
}
