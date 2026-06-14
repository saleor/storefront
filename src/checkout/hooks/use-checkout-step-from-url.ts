import { useMemo } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { useLiveCheckoutSearchString } from "@/checkout/lib/checkout-search-params";
import { useCurrentCheckoutStepFromParams } from "@/checkout/hooks/use-checkout-steps";
import type { CheckoutStep } from "@/checkout/views/saleor-checkout/flow";

/** Current checkout step from the live URL bar (includes shallow `?step=` updates). */
export function useCheckoutStepFromUrl(
	searchParams: ReadonlyURLSearchParams,
	isShippingRequired: boolean,
): CheckoutStep {
	const searchString = useLiveCheckoutSearchString(searchParams.toString());

	return useCurrentCheckoutStepFromParams(
		useMemo(() => new URLSearchParams(searchString), [searchString]),
		isShippingRequired,
	);
}
