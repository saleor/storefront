import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { getQueryParams } from "@/checkout/lib/utils/url";
import { useOrderData } from "@/checkout/providers/order-data";

/** Order confirmation data — server-hydrated from the RSC page. */
export const useOrder = () => {
	const { order, orderId: sessionOrderId } = useOrderData();
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
