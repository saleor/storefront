"use client";

import { type FC } from "react";

import { useCheckoutPaymentReturnError } from "@/checkout/providers/checkout-payment-return-error";
import { useStripeReturnCompletion } from "./use-stripe-return-completion";

type StripeCheckoutReturnHandlerProps = {
	checkoutId: string;
	channelSlug?: string;
};

/**
 * Runs after Stripe redirect (3DS, etc.) at checkout-shell level so completion
 * is not tied to the payment step being mounted. Errors surface on the payment step.
 */
export const StripeCheckoutReturnHandler: FC<StripeCheckoutReturnHandlerProps> = ({
	checkoutId,
	channelSlug,
}) => {
	const { setError } = useCheckoutPaymentReturnError();

	useStripeReturnCompletion({
		checkoutId,
		channelSlug,
		onError: setError,
	});

	return null;
};
