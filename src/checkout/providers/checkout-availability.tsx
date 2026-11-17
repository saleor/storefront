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
	checkoutAvailability,
	type CheckoutAvailability,
	type CheckoutAvailabilityIssue,
} from "@/checkout/lib/checkout-availability";
import type { AvailabilityFailure } from "@/checkout/lib/validate-checkout-fulfillment";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

type CheckoutAvailabilityContextValue = {
	/**
	 * What blocks the shopper right now: the lines the live checkout's `problems` list, and a
	 * destination issue a step reported from a rejected mutation. `null` when nothing does.
	 */
	availability: CheckoutAvailability | null;
	/** Sets or clears the reported destination issue (legacy error flow). */
	setDestinationIssue: Dispatch<SetStateAction<CheckoutAvailabilityIssue | null>>;
	/**
	 * After a failed stock check: adopt the fresh checkout Saleor answered with (its `problems`
	 * then decide what blocks) and record a destination issue.
	 */
	reportAvailability: (failure: AvailabilityFailure) => void;
};

const CheckoutAvailabilityContext = createContext<CheckoutAvailabilityContextValue | null>(null);

export function CheckoutAvailabilityProvider({ children }: { children: ReactNode }) {
	const { checkout, setCheckout } = useCheckoutData();
	const [destination, setDestinationIssue] = useState<CheckoutAvailabilityIssue | null>(null);
	const availability = useMemo(() => checkoutAvailability(checkout, destination), [checkout, destination]);

	const reportAvailability = useCallback(
		(failure: AvailabilityFailure) => {
			if (failure.checkout) setCheckout(failure.checkout);
			if (failure.destination) setDestinationIssue(failure.destination);
		},
		[setCheckout],
	);

	const value = useMemo(
		() => ({ availability, setDestinationIssue, reportAvailability }),
		[availability, reportAvailability],
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
