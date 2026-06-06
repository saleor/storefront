"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { reconcileCheckoutSessionStorage } from "@/checkout/lib/payment/reconcile-checkout-session-storage";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

/** Drops stale sessionStorage flags when the shopper opens a different checkout. */
export function CheckoutSessionCleanup() {
	const { checkoutId, orderId } = useCheckoutSession();
	const searchParams = useSearchParams();

	useEffect(() => {
		reconcileCheckoutSessionStorage({
			checkoutId,
			orderId,
			processingPayment: searchParams.get("processingPayment") === "true",
		});
	}, [checkoutId, orderId, searchParams]);

	return null;
}
