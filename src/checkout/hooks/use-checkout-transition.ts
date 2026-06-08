"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";

import { useLiveCheckoutSearchParams } from "@/checkout/lib/checkout-search-params";
import {
	isCheckoutPaymentActive,
	subscribePaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

export type CheckoutTransition = "completing" | null;

/** Guards checkout UI during payment → order transitions (avoids step-1 skeleton flashes). */
export function useCheckoutTransition(): CheckoutTransition {
	const searchParams = useSearchParams();
	const liveSearchParams = useLiveCheckoutSearchParams(searchParams);
	const { checkoutId } = useCheckoutSession();
	const [completingRevision, setCompletingRevision] = useState(0);
	// Client snapshot is true only after hydration — keeps sessionStorage reads off the server pass.
	const isClientHydrated = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

	useEffect(() => subscribePaymentCompleting(() => setCompletingRevision((revision) => revision + 1)), []);

	return useMemo(() => {
		// sessionStorage is client-only — must match the server's first paint (no completing screen).
		if (!isClientHydrated) {
			return null;
		}

		const checkoutIdFromUrl = liveSearchParams.get("checkout");

		if (isCheckoutPaymentActive(liveSearchParams, checkoutId ?? checkoutIdFromUrl)) {
			return "completing";
		}

		return null;
	}, [checkoutId, completingRevision, isClientHydrated, liveSearchParams]);
}
