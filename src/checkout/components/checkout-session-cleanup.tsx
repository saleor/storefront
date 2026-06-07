"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { reconcileCheckoutSessionStorage } from "@/checkout/lib/payment/reconcile-checkout-session-storage";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

/** Drops stale sessionStorage flags when the shopper opens a different checkout. */
export function CheckoutSessionCleanup() {
	const { checkoutId } = useCheckoutSession();
	const searchParams = useSearchParams();

	useEffect(() => {
		reconcileCheckoutSessionStorage({
			checkoutId,
			processingPayment: searchParams.get("processingPayment") === "true",
		});
	}, [checkoutId, searchParams]);

	return null;
}
