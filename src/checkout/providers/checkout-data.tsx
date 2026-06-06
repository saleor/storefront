"use client";

import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useState } from "react";

import { syncCheckoutFromServer } from "@/app/(checkout)/actions";
import type { ServerCheckout, ServerOrder, ShippingCountries } from "@/checkout/lib/checkout-types";
import { adoptCheckoutSnapshot, resolveSessionCheckout } from "@/checkout/lib/checkout-sync";

export type CheckoutLoadState = "order" | "none" | "not_found" | "empty" | "error" | "ready";

export type RefreshCheckoutOptions = {
	/** When false, returns fresh data without updating context (keeps Stripe Elements mounted). */
	updateState?: boolean;
};

export type CheckoutDataContextValue = {
	loadState: CheckoutLoadState;
	checkout: ServerCheckout | null;
	order: ServerOrder | null;
	shippingCountries: ShippingCountries;
	setCheckout: (checkout: ServerCheckout) => void;
	/**
	 * Re-fetch checkout from Saleor and replace client state.
	 * Use after promo changes or when the cart must reflect server totals immediately.
	 * Always replaces — does not merge with in-flow form edits.
	 */
	/** Re-fetch from Saleor; returns null when the checkout is missing or the request fails. */
	refreshCheckout: (options?: RefreshCheckoutOptions) => Promise<ServerCheckout | null>;
};

const CheckoutDataContext = createContext<CheckoutDataContextValue | null>(null);

type CheckoutDataProviderProps = {
	checkoutId: string | null;
	loadState: CheckoutLoadState;
	initialOrder: ServerOrder | null;
	shippingCountries: ShippingCountries;
	children: ReactNode;
};

export function CheckoutDataProvider({
	checkoutId,
	loadState,
	initialOrder,
	shippingCountries,
	children,
}: CheckoutDataProviderProps) {
	const [checkout, setCheckout] = useState<ServerCheckout | null>(null);

	const refreshCheckout = useCallback(
		async (options?: RefreshCheckoutOptions): Promise<ServerCheckout | null> => {
			if (!checkoutId) {
				return null;
			}

			const result = await syncCheckoutFromServer(checkoutId);
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

	// Live load on entry — bypasses Next.js router/RSC cache after cart edits.
	useEffect(() => {
		if (!checkoutId || loadState !== "ready") {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- drop stale cart when leaving checkout
			setCheckout(null);
			return;
		}

		let cancelled = false;

		void syncCheckoutFromServer(checkoutId).then((result) => {
			if (cancelled || !result.ok) {
				return;
			}

			const freshCheckout = result.checkout;
			if (!freshCheckout) {
				return;
			}

			// Entry sync: merge only when cart id/lines unchanged so in-flow edits survive
			// a redundant fetch; replace when lines or checkout id changed.
			setCheckout((current) => adoptCheckoutSnapshot(current, freshCheckout));
		});

		return () => {
			cancelled = true;
		};
	}, [checkoutId, loadState]);

	const sessionCheckout = useMemo(
		() => resolveSessionCheckout(checkout, checkoutId, loadState),
		[checkout, checkoutId, loadState],
	);

	const value = useMemo(
		() => ({
			loadState,
			checkout: sessionCheckout,
			order: initialOrder,
			shippingCountries,
			setCheckout,
			refreshCheckout,
		}),
		[initialOrder, loadState, refreshCheckout, sessionCheckout, shippingCountries],
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
