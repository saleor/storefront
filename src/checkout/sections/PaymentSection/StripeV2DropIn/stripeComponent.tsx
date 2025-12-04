"use client";

import { loadStripe, type Stripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { CheckoutForm } from "./stripeForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface StripeConfig {
	data?: {
		stripePublishableKey?: string;
	};
}

export const StripeComponent = ({ config }: { config: StripeConfig }) => {
	const { checkout } = useCheckout();

	const publishableKey = config?.data?.stripePublishableKey;
	const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
	const [loadingError, setLoadingError] = useState<string | null>(null);

	useEffect(() => {
		if (!publishableKey) {
			return;
		}

		let isMounted = true;

		loadStripe(publishableKey)
			.then((stripe) => {
				if (isMounted) {
					setStripePromise(stripe);
					setLoadingError(null);
				}
			})
			.catch((error) => {
				if (!isMounted) {
					return;
				}
				console.error("Error initializing Stripe:", error);
				setLoadingError("Failed to initialize payment system");
			});

		return () => {
			isMounted = false;
		};
	}, [publishableKey]);

	useEffect(() => {
		if (!publishableKey) {
			console.error("Missing Stripe publishable key");
		}
	}, [publishableKey]);

	if (!publishableKey) {
		return <div className="text-red-500">Missing payment gateway configuration</div>;
	}

	if (loadingError) {
		return <div className="text-red-500">{loadingError}</div>;
	}

	if (!stripePromise) {
		return <div>Loading payment system...</div>;
	}

	const amount = Math.round(checkout.totalPrice.gross.amount * 100);
	const currency = checkout.totalPrice.gross.currency?.toLowerCase() || "usd";
	const stripeOptions: StripeElementsOptions = {
		mode: "payment",
		amount,
		appearance: { theme: "stripe" },
		currency,
	};

	return (
		<Elements options={stripeOptions} stripe={stripePromise}>
			<CheckoutForm />
		</Elements>
	);
};
