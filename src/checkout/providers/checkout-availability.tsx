"use client";

import {
	createContext,
	use,
	useMemo,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";

import type { CheckoutAvailabilityIssue } from "@/checkout/lib/checkout-availability";

type CheckoutAvailabilityContextValue = {
	availabilityIssue: CheckoutAvailabilityIssue | null;
	setAvailabilityIssue: Dispatch<SetStateAction<CheckoutAvailabilityIssue | null>>;
};

const CheckoutAvailabilityContext = createContext<CheckoutAvailabilityContextValue | null>(null);

export function CheckoutAvailabilityProvider({ children }: { children: ReactNode }) {
	const [availabilityIssue, setAvailabilityIssue] = useState<CheckoutAvailabilityIssue | null>(null);

	const value = useMemo(() => ({ availabilityIssue, setAvailabilityIssue }), [availabilityIssue]);

	return <CheckoutAvailabilityContext value={value}>{children}</CheckoutAvailabilityContext>;
}

export function useCheckoutAvailability(): CheckoutAvailabilityContextValue {
	const context = use(CheckoutAvailabilityContext);
	if (!context) {
		throw new Error("useCheckoutAvailability must be used within CheckoutAvailabilityProvider");
	}
	return context;
}
