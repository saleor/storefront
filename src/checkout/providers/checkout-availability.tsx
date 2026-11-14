"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

import {
	mergeAvailabilityIssues,
	availabilityIssueFromProblems,
	type CheckoutAvailabilityIssue,
} from "@/checkout/lib/checkout-availability";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

type CheckoutAvailabilityContextValue = {
	/**
	 * What blocks the shopper right now: the issue a step reported from a rejected mutation,
	 * merged with the lines Saleor lists in the live checkout's `problems`.
	 */
	availabilityIssue: CheckoutAvailabilityIssue | null;
	/** Sets or clears the reported issue. Lines in `checkout.problems` stay flagged until Saleor clears them. */
	setAvailabilityIssue: (issue: CheckoutAvailabilityIssue | null) => void;
};

const CheckoutAvailabilityContext = createContext<CheckoutAvailabilityContextValue | null>(null);

export function CheckoutAvailabilityProvider({ children }: { children: ReactNode }) {
	const { checkout } = useCheckoutData();
	const [reportedIssue, setReportedIssue] = useState<CheckoutAvailabilityIssue | null>(null);
	const setAvailabilityIssue = useCallback((issue: CheckoutAvailabilityIssue | null) => {
		setReportedIssue(issue);
	}, []);

	const problems = checkout?.problems;
	const availabilityIssue = useMemo(
		() => mergeAvailabilityIssues(reportedIssue, availabilityIssueFromProblems(problems)),
		[reportedIssue, problems],
	);

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
