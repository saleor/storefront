import type { OrderDetailsFragment } from "@/gql/graphql";
import { getCustomerOrderStatusLabel } from "./order-status-labels";

export type OrderRowLabels = {
	orderNumber: string;
	itemCount: string;
	statusLabel: string;
};

type OrderStatusLabelKey = "UNFULFILLED" | "UNCONFIRMED" | "PARTIALLY_FULFILLED" | "FULFILLED";

type AccountOrderTranslator = (
	key: "orders.orderNumber" | "common.itemCount",
	values?: { number?: string; count?: number },
) => string;

export function buildOrderRowLabels(
	t: AccountOrderTranslator,
	tStatus: (key: OrderStatusLabelKey) => string,
	order: OrderDetailsFragment,
): OrderRowLabels {
	const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

	return {
		orderNumber: t("orders.orderNumber", { number: order.number }),
		itemCount: t("common.itemCount", { count: itemCount }),
		statusLabel: getCustomerOrderStatusLabel(tStatus, order.status, order.statusDisplay),
	};
}
