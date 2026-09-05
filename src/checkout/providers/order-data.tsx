"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

import type { ServerOrder } from "@/checkout/lib/checkout-types";
import type { OrderViewAccess } from "@/lib/order-view/sanitize";

export type OrderDataContextValue = {
	order: ServerOrder | null;
	orderId: string | null;
	access: OrderViewAccess;
};

const OrderDataContext = createContext<OrderDataContextValue | null>(null);

type OrderDataProviderProps = {
	orderId: string | null;
	initialOrder: ServerOrder | null;
	access: OrderViewAccess;
	children: ReactNode;
};

/** Server-hydrated order for `/order/{key}` — no checkout cart state. */
export function OrderDataProvider({ orderId, initialOrder, access, children }: OrderDataProviderProps) {
	const value = useMemo(
		() => ({
			order: initialOrder,
			orderId,
			access,
		}),
		[initialOrder, orderId, access],
	);

	return <OrderDataContext value={value}>{children}</OrderDataContext>;
}

export function useOrderData(): OrderDataContextValue {
	const context = use(OrderDataContext);
	if (!context) {
		throw new Error("useOrderData must be used within OrderDataProvider");
	}
	return context;
}
