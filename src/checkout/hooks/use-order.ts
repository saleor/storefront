import { useMemo } from "react";

import { useOrderData } from "@/checkout/providers/order-data";

/** Order confirmation data — server-hydrated from the RSC page. */
export const useOrder = () => {
	const { order, orderId, access } = useOrderData();

	return useMemo(
		() => ({
			order,
			loading: false,
			orderId,
			access,
		}),
		[order, orderId, access],
	);
};
