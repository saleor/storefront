"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { getPendingOrderId } from "@/checkout/lib/payment/checkout-completion-storage";
import { isCheckoutPaymentActive } from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

export type CheckoutTransition = "completing" | "navigating-to-order" | null;

/** Guards checkout UI during payment → order transitions (avoids step-1 skeleton flashes). */
export function useCheckoutTransition(): CheckoutTransition {
	const searchParams = useSearchParams();
	const { checkoutId } = useCheckoutSession();

	return useMemo(() => {
		const checkoutIdFromUrl = searchParams.get("checkout");

		// Brief window between setPendingOrderId() and hard navigation to ?order=….
		if (getPendingOrderId() && !searchParams.get("order") && !checkoutIdFromUrl) {
			return "navigating-to-order";
		}

		if (isCheckoutPaymentActive(searchParams, checkoutId ?? checkoutIdFromUrl)) {
			return "completing";
		}

		return null;
	}, [checkoutId, searchParams]);
}
