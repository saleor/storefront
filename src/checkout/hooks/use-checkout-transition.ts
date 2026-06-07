"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useLiveCheckoutSearchParams } from "@/checkout/lib/checkout-search-params";
import { isCheckoutPaymentActive } from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

export type CheckoutTransition = "completing" | null;

/** Guards checkout UI during payment → order transitions (avoids step-1 skeleton flashes). */
export function useCheckoutTransition(): CheckoutTransition {
	const searchParams = useSearchParams();
	const liveSearchParams = useLiveCheckoutSearchParams(searchParams);
	const { checkoutId } = useCheckoutSession();

	return useMemo(() => {
		const checkoutIdFromUrl = liveSearchParams.get("checkout");

		if (isCheckoutPaymentActive(liveSearchParams, checkoutId ?? checkoutIdFromUrl)) {
			return "completing";
		}

		return null;
	}, [checkoutId, liveSearchParams]);
}
