"use client";

import { useMemo, useState, type FC } from "react";
import { useSearchParams } from "next/navigation";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { PaymentError } from "@/checkout/components/payment/payment-error";
import { useStripeReturnCompletion } from "./use-stripe-return-completion";

type StripeCheckoutReturnHandlerProps = {
	checkoutId: string;
	channelSlug?: string;
};

/**
 * Runs after Stripe redirect (3DS, etc.) at checkout-shell level so completion
 * is not tied to the payment step being mounted.
 */
export const StripeCheckoutReturnHandler: FC<StripeCheckoutReturnHandlerProps> = ({
	checkoutId,
	channelSlug,
}) => {
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const isReturnUrl = useMemo(() => {
		const { processingPayment, paymentIntent, paymentIntentClientSecret } = getQueryParams(searchParams);
		return Boolean(processingPayment && paymentIntent && paymentIntentClientSecret);
	}, [searchParams]);

	const [, setIsProcessing] = useState(isReturnUrl);

	useStripeReturnCompletion({
		checkoutId,
		channelSlug,
		onError: setError,
		onProcessingChange: setIsProcessing,
	});

	if (!error) {
		return null;
	}

	return (
		<div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
			<PaymentError message={error} />
		</div>
	);
};
