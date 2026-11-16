"use client";

import {
	createContext,
	use,
	useCallback,
	useMemo,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";

import {
	mergeAvailabilityIssues,
	availabilityIssueFromProblems,
	nextReportedIssue,
	stillReportedIssue,
	type CheckoutAvailabilityIssue,
	type ReportedAvailabilityIssue,
} from "@/checkout/lib/checkout-availability";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

type CheckoutAvailabilityContextValue = {
	/**
	 * What blocks the shopper right now: the issue a step reported from a rejected mutation,
	 * merged with the lines Saleor lists in the live checkout's `problems`.
	 */
	availabilityIssue: CheckoutAvailabilityIssue | null;
	/**
	 * Sets or clears the reported issue. Lines in `checkout.problems` stay flagged until
	 * Saleor clears them; a reported stock issue lapses when the checkout in context changes.
	 * An updater function receives the reported issue that still applies, not the merged one,
	 * so a slow response cannot restore an issue another step already cleared.
	 */
	setAvailabilityIssue: Dispatch<SetStateAction<CheckoutAvailabilityIssue | null>>;
};

const CheckoutAvailabilityContext = createContext<CheckoutAvailabilityContextValue | null>(null);

export function CheckoutAvailabilityProvider({ children }: { children: ReactNode }) {
	const { checkout } = useCheckoutData();
	const [reported, setReported] = useState<ReportedAvailabilityIssue | null>(null);
	const setAvailabilityIssue = useCallback<Dispatch<SetStateAction<CheckoutAvailabilityIssue | null>>>(
		(action) => setReported((previous) => nextReportedIssue(previous, action, checkout)),
		[checkout],
	);

	const reportedIssue = stillReportedIssue(reported, checkout);
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
