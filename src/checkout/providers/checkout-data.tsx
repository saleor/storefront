"use client";

import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useState } from "react";

import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import type { CheckoutLoadState, ServerCheckout, ShippingCountries } from "@/checkout/lib/checkout-types";
import { adoptCheckoutSnapshot, resolveSessionCheckout } from "@/checkout/lib/checkout-sync";

export type { CheckoutLoadState };

export type RefreshCheckoutOptions = {
	/** When false, returns fresh data without updating context (keeps Stripe Elements mounted). */
	updateState?: boolean;
};

export type CheckoutDataContextValue = {
	loadState: CheckoutLoadState;
	checkout: ServerCheckout | null;
	shippingCountries: ShippingCountries;
	setCheckout: (checkout: ServerCheckout) => void;
	/** Re-fetch from Saleor; returns null when the checkout is missing or the request fails. */
	refreshCheckout: (options?: RefreshCheckoutOptions) => Promise<ServerCheckout | null>;
};

const CheckoutDataContext = createContext<CheckoutDataContextValue | null>(null);

type CheckoutDataProviderProps = {
	checkoutId: string | null;
	loadState: CheckoutLoadState;
	initialCheckout: ServerCheckout | null;
	shippingCountries: ShippingCountries;
	children: ReactNode;
};

export function CheckoutDataProvider({
	checkoutId,
	loadState,
	initialCheckout,
	shippingCountries,
	children,
}: CheckoutDataProviderProps) {
	const [checkout, setCheckout] = useState<ServerCheckout | null>(initialCheckout);

	const refreshCheckout = useCallback(
		async (options?: RefreshCheckoutOptions): Promise<ServerCheckout | null> => {
			if (!checkoutId) {
				return null;
			}

			const result = await getCheckoutTransport().fetchCheckout(checkoutId);
			if (!result.ok || !result.checkout) {
				return null;
			}

			if (result.checkout.id !== checkoutId) {
				return null;
			}

			if (options?.updateState !== false) {
				// Explicit refresh: always adopt server snapshot (cart totals, promos, line items).
				setCheckout(result.checkout);
			}

			return result.checkout;
		},
		[checkoutId],
	);

	// Pick up RSC snapshot updates (e.g. after cart revalidation or `useRefreshCheckoutRsc()`).
	useEffect(() => {
		if (loadState !== "ready" || !initialCheckout) {
			if (loadState !== "ready") {
				// eslint-disable-next-line react-hooks/set-state-in-effect -- drop cart when leaving checkout
				setCheckout(null);
			}
			return;
		}

		setCheckout((current) => {
			if (!current) {
				return initialCheckout;
			}

			return adoptCheckoutSnapshot(current, initialCheckout);
		});
	}, [initialCheckout, loadState]);

	const sessionCheckout = useMemo(
		() => resolveSessionCheckout(checkout, checkoutId, loadState),
		[checkout, checkoutId, loadState],
	);

	const value = useMemo(
		() => ({
			loadState,
			checkout: sessionCheckout,
			shippingCountries,
			setCheckout,
			refreshCheckout,
		}),
		[loadState, refreshCheckout, sessionCheckout, shippingCountries],
	);

	return <CheckoutDataContext value={value}>{children}</CheckoutDataContext>;
}

export function useCheckoutData(): CheckoutDataContextValue {
	const context = use(CheckoutDataContext);
	if (!context) {
		throw new Error("useCheckoutData must be used within CheckoutDataProvider");
	}
	return context;
}
