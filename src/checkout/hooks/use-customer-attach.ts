"use client";

import { useEffect, useRef, useState } from "react";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import { useUser } from "@/checkout/hooks/use-user";
import { useCheckout } from "@/checkout/hooks/use-checkout";

function isCheckoutAlreadyAttachedError(error: string): boolean {
	const message = error.toLowerCase();
	return message.includes("cannot reassign") || message.includes("already attached");
}

/**
 * Attaches the logged-in user to the checkout via server action.
 *
 * Runs once when user is authenticated and checkout has no user yet.
 */
export const useCustomerAttach = () => {
	const { checkout, setCheckout, checkoutId } = useCheckout();
	const { authenticated } = useUser();
	const [attachSettled, setAttachSettled] = useState(false);
	const inFlightRef = useRef(false);

	const checkoutUserId = checkout?.user?.id;
	const shouldSkip = Boolean(checkoutUserId) || attachSettled || !authenticated || !checkoutId;

	useEffect(() => {
		if (shouldSkip || inFlightRef.current || !checkoutId) {
			return;
		}

		inFlightRef.current = true;

		void getCheckoutTransport()
			.attachCustomer(checkoutId)
			.then((result) => {
				if (result.ok) {
					setCheckout(result.checkout);
					setAttachSettled(true);
					return;
				}

				if (result.error && isCheckoutAlreadyAttachedError(result.error)) {
					setAttachSettled(true);
				}
			})
			.finally(() => {
				inFlightRef.current = false;
			});
	}, [authenticated, checkoutId, checkoutUserId, attachSettled, setCheckout, shouldSkip]);
};
