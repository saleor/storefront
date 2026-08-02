"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
	getCheckoutStepIntent,
	recordCheckoutStepIntent,
	resolveStepReassertion,
	updateCheckoutQuery,
	useLiveCheckoutSearchString,
} from "@/checkout/lib/checkout-search-params";

function readStepFromLocation(): string | null {
	return new URLSearchParams(window.location.search).get("step");
}

/**
 * Self-healing `?step=` URL.
 *
 * Step changes are shallow history writes the App Router never sees, so any router-level
 * URL restore (server-action revalidation, RSC refresh) rewinds checkout to Contact —
 * mid-payment this tore down `stripe.confirmPayment()` and left orphaned PaymentIntents.
 *
 * The guard tracks the step the shopper intends to be on and re-asserts it whenever any
 * history write drops it. Browser Back/Forward expresses NEW intent, so popstate updates
 * the intent instead of fighting the shopper.
 */
export function CheckoutStepUrlGuard() {
	const searchParams = useSearchParams();
	const liveSearch = useLiveCheckoutSearchString(searchParams.toString());

	useEffect(() => {
		// Deep links / full page loads seed intent from the real URL.
		const stepFromUrl = readStepFromLocation();
		if (stepFromUrl && !getCheckoutStepIntent()) {
			recordCheckoutStepIntent(stepFromUrl);
		}

		const adoptIntentFromUrl = () => {
			recordCheckoutStepIntent(readStepFromLocation());
		};
		window.addEventListener("popstate", adoptIntentFromUrl);
		return () => window.removeEventListener("popstate", adoptIntentFromUrl);
	}, []);

	useEffect(() => {
		// Heal one macrotask later, NOT synchronously and NOT in a microtask. On browser
		// Back, Next's popstate handler (registered before checkout hydrates) flushes the
		// traversal synchronously inside its own listener, running this effect while the
		// intent is still the PRE-Back step — healing here would clobber the traversal and
		// `adoptIntentFromUrl` (later in the listener chain) would then adopt the clobbered
		// URL, trapping the shopper on the old step. Microtask checkpoints run between
		// popstate listeners, so only a macrotask is guaranteed to run after `adoptIntentFromUrl`.
		const timer = window.setTimeout(() => {
			const step = resolveStepReassertion(window.location.search, getCheckoutStepIntent());
			if (step) {
				updateCheckoutQuery({ step });
			}
		}, 0);
		return () => window.clearTimeout(timer);
		// `searchParams` re-runs the check after router commits that don't change the URL string.
	}, [liveSearch, searchParams]);

	return null;
}
