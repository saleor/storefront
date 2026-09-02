"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

import type { CheckoutAvailabilityIssue } from "@/checkout/lib/checkout-availability";

type CheckoutAvailabilityContextValue = {
	availabilityIssue: CheckoutAvailabilityIssue | null;
	setAvailabilityIssue: (issue: CheckoutAvailabilityIssue | null) => void;
};

const CheckoutAvailabilityContext = createContext<CheckoutAvailabilityContextValue | null>(null);

export function CheckoutAvailabilityProvider({ children }: { children: ReactNode }) {
	const [availabilityIssue, setAvailabilityIssueState] = useState<CheckoutAvailabilityIssue | null>(null);
	const setAvailabilityIssue = useCallback((issue: CheckoutAvailabilityIssue | null) => {
		setAvailabilityIssueState(issue);
	}, []);

	const value = useMemo(
		() => ({ availabilityIssue, setAvailabilityIssue }),
		[availabilityIssue, setAvailabilityIssue],
	);

	return <CheckoutAvailabilityContext value={value}>{children}</CheckoutAvailabilityContext>;
}

export function useCheckoutAvailability(): CheckoutAvailabilityContextValue {
	const context = use(CheckoutAvailabilityContext);
	if (!context) {
		throw new Error("useCheckoutAvailability must be used within CheckoutAvailabilityProvider");
	}
	return context;
}
