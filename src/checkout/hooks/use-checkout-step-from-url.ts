import { useMemo } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { useCheckoutStepIntent, useLiveCheckoutSearchString } from "@/checkout/lib/checkout-search-params";
import { useCurrentCheckoutStepFromParams } from "@/checkout/hooks/use-checkout-steps";
import type { CheckoutStep } from "@/checkout/views/saleor-checkout/flow";

/**
 * Current checkout step for rendering. The shopper's step intent wins over the raw URL:
 * router-level URL restores (server-action revalidation) can transiently flash a stale
 * `?step=` before `CheckoutStepUrlGuard` heals it, and rendering from the raw URL would
 * remount the flashed step (payment remounts re-init Stripe and fire new server actions,
 * whose revalidations restore the stale URL again — a self-sustaining loop).
 */
export function useCheckoutStepFromUrl(
	searchParams: ReadonlyURLSearchParams,
	isShippingRequired: boolean,
): CheckoutStep {
	const searchString = useLiveCheckoutSearchString(searchParams.toString());
	const stepIntent = useCheckoutStepIntent();

	const params = useMemo(() => {
		const merged = new URLSearchParams(searchString);
		if (stepIntent) {
			merged.set("step", stepIntent);
		}
		return merged;
	}, [searchString, stepIntent]);

	return useCurrentCheckoutStepFromParams(params, isShippingRequired);
}
