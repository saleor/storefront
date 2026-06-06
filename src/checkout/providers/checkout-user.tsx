"use client";

import { useRouter } from "next/navigation";
import { createContext, type ReactNode, use, useCallback, useMemo } from "react";

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
 * Sign-in uses syncAuthSurfacesAfterSignIn; sign-out uses logout() + router.refresh().
 */
export function CheckoutUserProvider({
	initialUser,
	children,
}: {
	initialUser: CheckoutUser | null;
	children: ReactNode;
}) {
	const router = useRouter();

	const refetch = useCallback(async () => {
		router.refresh();
	}, [router]);

	const value = useMemo(
		() => ({
			user: initialUser,
			authenticated: Boolean(initialUser?.id),
			loading: false,
			refetch,
		}),
		[initialUser, refetch],
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
