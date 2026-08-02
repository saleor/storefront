"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
	syncCheckoutRouterWithLiveUrl,
	useLiveCheckoutSearchString,
} from "@/checkout/lib/checkout-search-params";

function getStepParam(search: string): string | null {
	return new URLSearchParams(search).get("step");
}

/**
 * Keeps Next's router search snapshot aligned with shallow `?step=` updates.
 * Mount on the payment step so server-action revalidation does not rewind to Contact.
 *
 * Also re-syncs on unmount when the `?step=` diverged: after Back to shipping, the
 * router's canonical URL would otherwise stay `?step=payment` and every shipping-step
 * server action would restore it, bouncing the shopper straight back to payment.
 * Scoped to step divergence so it never fires during the payment-success document
 * navigation (`window.location.replace`), where the step stays `payment`.
 */
export function useSyncCheckoutRouterUrl(enabled = true): void {
	const router = useRouter();
	const searchParams = useSearchParams();
	const liveSearch = useLiveCheckoutSearchString(searchParams.toString());

	const routerSearchRef = useRef(searchParams);

	useEffect(() => {
		routerSearchRef.current = searchParams;
	}, [searchParams]);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		syncCheckoutRouterWithLiveUrl(router, searchParams.toString());
	}, [enabled, liveSearch, router, searchParams]);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const mountPathname = window.location.pathname;

		return () => {
			const routerSearch = routerSearchRef.current.toString();
			const liveStep = getStepParam(window.location.search);
			const routerStep = getStepParam(routerSearch);

			if (window.location.pathname === mountPathname && liveStep !== routerStep) {
				syncCheckoutRouterWithLiveUrl(router, routerSearch);
			}
		};
	}, [enabled, router]);
}
