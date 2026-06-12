import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { Checkout } from "@/checkout/graphql";
import { extractCheckoutIdFromParams, getQueryParams } from "@/checkout/lib/utils/url";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";

type UseCheckoutOptions = {
	pause?: boolean;
};

export const useCheckout = ({ pause = false }: UseCheckoutOptions = {}) => {
	const { checkout, setCheckout, refreshCheckout } = useCheckoutData();
	const { checkoutId: sessionCheckoutId } = useCheckoutSession();
	const searchParams = useSearchParams();
	const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
	const checkoutIdFromUrl = extractCheckoutIdFromParams(queryParams);
	const checkoutId = pause ? null : checkoutIdFromUrl ?? sessionCheckoutId;

	return useMemo(
		() => ({
			checkout: checkout as Checkout | null,
			setCheckout,
			checkoutResolved: checkout !== null,
			fetching: false,
			checkoutId,
			refetch: refreshCheckout,
		}),
		[checkout, checkoutId, refreshCheckout, setCheckout],
	);
};
