"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

type CheckoutPaymentReturnErrorContextValue = {
	error: string | null;
	setError: (message: string) => void;
	clearError: () => void;
};

const CheckoutPaymentReturnErrorContext = createContext<CheckoutPaymentReturnErrorContextValue | null>(null);

/** Stripe 3DS return failures — shown inline on the payment step, not over the processing screen. */
export function CheckoutPaymentReturnErrorProvider({ children }: { children: ReactNode }) {
	const [error, setErrorState] = useState<string | null>(null);
	const setError = useCallback((message: string) => {
		setErrorState(message);
	}, []);
	const clearError = useCallback(() => {
		setErrorState(null);
	}, []);

	const value = useMemo(
		() => ({
			error,
			setError,
			clearError,
		}),
		[clearError, error, setError],
	);

	return <CheckoutPaymentReturnErrorContext value={value}>{children}</CheckoutPaymentReturnErrorContext>;
}

export function useCheckoutPaymentReturnError(): CheckoutPaymentReturnErrorContextValue {
	const context = use(CheckoutPaymentReturnErrorContext);
	if (!context) {
		throw new Error("useCheckoutPaymentReturnError must be used within CheckoutPaymentReturnErrorProvider");
	}
	return context;
}
