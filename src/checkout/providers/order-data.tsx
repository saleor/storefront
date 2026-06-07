"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

import type { ServerOrder } from "@/checkout/lib/checkout-types";

export type OrderDataContextValue = {
	order: ServerOrder | null;
	orderId: string | null;
};

const OrderDataContext = createContext<OrderDataContextValue | null>(null);

type OrderDataProviderProps = {
	orderId: string | null;
	initialOrder: ServerOrder | null;
	children: ReactNode;
};

/** Server-hydrated order for `/checkout/complete` — no checkout cart state. */
export function OrderDataProvider({ orderId, initialOrder, children }: OrderDataProviderProps) {
	const value = useMemo(
		() => ({
			order: initialOrder,
			orderId,
		}),
		[initialOrder, orderId],
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
