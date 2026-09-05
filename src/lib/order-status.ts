export type CustomerOrderStatusKey = "UNFULFILLED" | "UNCONFIRMED" | "PARTIALLY_FULFILLED" | "FULFILLED";

const CUSTOMER_ORDER_STATUS_KEYS: Record<string, CustomerOrderStatusKey> = {
	UNFULFILLED: "UNFULFILLED",
	UNCONFIRMED: "UNCONFIRMED",
	PARTIALLY_FULFILLED: "PARTIALLY_FULFILLED",
	FULFILLED: "FULFILLED",
};

export function getCustomerOrderStatusLabel(
	t: (key: CustomerOrderStatusKey) => string,
	status: string,
	statusDisplay: string,
): string {
	const key = CUSTOMER_ORDER_STATUS_KEYS[status];
	return key ? t(key) : statusDisplay;
}
