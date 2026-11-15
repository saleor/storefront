"use client";

import { createContext, use, type ReactNode } from "react";

import type { DeliveryPaymentSummary } from "@/lib/delivery-payment";

/** "Delivery and payment" for the start of checkout, built on the server by the session loader. */
const CheckoutDeliveryPaymentContext = createContext<DeliveryPaymentSummary | null>(null);

export function CheckoutDeliveryPaymentProvider({
	summary,
	children,
}: {
	summary: DeliveryPaymentSummary | null;
	children: ReactNode;
}) {
	return <CheckoutDeliveryPaymentContext value={summary}>{children}</CheckoutDeliveryPaymentContext>;
}

export function useCheckoutDeliveryPayment(): DeliveryPaymentSummary | null {
	return use(CheckoutDeliveryPaymentContext);
}
