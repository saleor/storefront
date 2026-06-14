import { OrderStatus } from "@/gql/graphql";

type OrderStatusLabelKey = "UNFULFILLED" | "UNCONFIRMED" | "PARTIALLY_FULFILLED" | "FULFILLED";

const CUSTOMER_ORDER_STATUS_KEYS: Partial<Record<OrderStatus, OrderStatusLabelKey>> = {
	[OrderStatus.Unfulfilled]: "UNFULFILLED",
	[OrderStatus.Unconfirmed]: "UNCONFIRMED",
	[OrderStatus.PartiallyFulfilled]: "PARTIALLY_FULFILLED",
	[OrderStatus.Fulfilled]: "FULFILLED",
};

export function getCustomerOrderStatusLabel(
	t: (key: OrderStatusLabelKey) => string,
	status: OrderStatus,
	statusDisplay: string,
): string {
	const key = CUSTOMER_ORDER_STATUS_KEYS[status];
	return key ? t(key) : statusDisplay;
}
