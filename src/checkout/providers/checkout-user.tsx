"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

import { useRefreshCheckoutRsc } from "@/checkout/hooks/use-refresh-checkout-rsc";
import type { CheckoutUser } from "@/checkout/lib/checkout-types";

type CheckoutUserContextValue = {
	user: CheckoutUser | null;
	authenticated: boolean;
	loading: boolean;
	refetch: () => Promise<void>;
};

const CheckoutUserContext = createContext<CheckoutUserContextValue | null>(null);

/**
 * Customer session hydrated from the RSC page (executeAuthenticatedGraphQL).
 * Sign-in uses syncAuthSurfacesAfterSignIn; sign-out uses logout() + `useRefreshCheckoutRsc()`.
 */
export function CheckoutUserProvider({
	initialUser,
	children,
}: {
	initialUser: CheckoutUser | null;
	children: ReactNode;
}) {
	const refreshCheckoutRsc = useRefreshCheckoutRsc();

	const value = useMemo(
		() => ({
			user: initialUser,
			authenticated: Boolean(initialUser?.id),
			loading: false,
			refetch: async () => {
				refreshCheckoutRsc();
			},
		}),
		[initialUser, refreshCheckoutRsc],
	);

	return <CheckoutUserContext value={value}>{children}</CheckoutUserContext>;
}

export function useCheckoutUser(): CheckoutUserContextValue {
	const context = use(CheckoutUserContext);
	if (!context) {
		throw new Error("useCheckoutUser must be used within CheckoutUserProvider");
	}
	return context;
}
