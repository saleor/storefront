import { useMemo } from "react";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { useSearchParams } from "next/navigation";

/** Order confirmation data — server-hydrated from the RSC page. */
export const useOrder = () => {
	const { order } = useCheckoutData();
	const { orderId: sessionOrderId } = useCheckoutSession();
	const searchParams = useSearchParams();
	const orderIdFromUrl = getQueryParams(searchParams).orderId;
	const orderId = orderIdFromUrl ?? sessionOrderId;

	return useMemo(
		() => ({
			order,
			loading: false,
			orderId,
		}),
		[order, orderId],
	);
};
