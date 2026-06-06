"use client";

import { createContext, type ReactNode, use } from "react";

export type CheckoutSession = {
	checkoutId: string | null;
	orderId: string | null;
};

const CheckoutSessionContext = createContext<CheckoutSession | null>(null);

type CheckoutSessionProviderProps = CheckoutSession & {
	children: ReactNode;
};

/**
 * Initial checkout/order ids from the server page `searchParams` (same HTTP request).
 * Used as a fallback when resolving the active id so SSR and hydration agree on first paint.
 * Live routing always prefers the current URL via `useSearchParams`.
 */
export function CheckoutSessionProvider({ checkoutId, orderId, children }: CheckoutSessionProviderProps) {
	return <CheckoutSessionContext value={{ checkoutId, orderId }}>{children}</CheckoutSessionContext>;
}

export function useCheckoutSession(): CheckoutSession {
	const session = use(CheckoutSessionContext);
	if (!session) {
		throw new Error("useCheckoutSession must be used within CheckoutSessionProvider");
	}
	return session;
}
