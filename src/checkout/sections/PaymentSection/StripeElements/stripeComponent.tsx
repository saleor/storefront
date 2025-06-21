"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useMemo, useState, useEffect } from "react";
import { type ParsedStripeGateway } from "../types";
import { CheckoutForm } from "./stripeElementsForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { usePaymentIntent } from "@/checkout/hooks/usePaymentQueries";

interface StripeComponentProps {
	config: ParsedStripeGateway;
}

export const StripeComponent = ({ config }: StripeComponentProps) => {
	const [isClient, setIsClient] = useState(false);

	// Ensure this only runs on the client side
	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return (
			<div className="flex h-32 animate-pulse items-center justify-center rounded-md bg-gray-200">
				<span className="text-gray-500">Loading payment form...</span>
			</div>
		);
	}

	return <StripeComponentClient config={config} />;
};

const StripeComponentClient = ({ config }: StripeComponentProps) => {
	const { checkout } = useCheckout();

	// Get the Stripe publishable key from the config
	const stripePublishableKey = config.data?.stripePublishableKey;

	// Prepare payment intent parameters
	const paymentIntentParams = useMemo(() => {
		if (!checkout?.id || !config.id || !checkout?.totalPrice?.gross?.amount) {
			return null;
		}
		return {
			checkoutId: checkout.id,
			gatewayId: config.id,
		};
	}, [checkout?.id, config.id, checkout?.totalPrice?.gross?.amount]);

	// Use React Query to manage payment intent
	const {
		data: paymentIntentData,
		isLoading: isLoadingPaymentIntent,
		error: paymentIntentError,
	} = usePaymentIntent(paymentIntentParams);

	const stripePromise = useMemo(
		() => stripePublishableKey && loadStripe(stripePublishableKey),
		[stripePublishableKey],
	);

	if (!stripePromise || !stripePublishableKey) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">
					Stripe configuration is missing. Please check your payment gateway setup.
				</p>
			</div>
		);
	}

	// Show error if payment intent initialization failed
	if (paymentIntentError) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">Payment initialization failed:</p>
				<p className="mt-2 text-red-700">{(paymentIntentError ).message}</p>
			</div>
		);
	}

	// Show loading state while initializing payment intent
	if (isLoadingPaymentIntent || !paymentIntentData?.paymentIntent?.stripeClientSecret) {
		return (
			<div className="flex h-32 animate-pulse items-center justify-center rounded-md bg-gray-200">
				<span className="text-gray-500">Initializing payment...</span>
			</div>
		);
	}

	// Show errors if the payment intent has errors
	if (paymentIntentData.paymentIntent.errors?.length) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">Payment initialization failed:</p>
				<ul className="mt-2 list-disc pl-5">
					{paymentIntentData.paymentIntent.errors.map((error, index) => (
						<li key={index} className="text-red-700">
							{error.message}
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<Elements
			options={{
				clientSecret: paymentIntentData.paymentIntent.stripeClientSecret,
				appearance: { theme: "stripe" },
			}}
			stripe={stripePromise}
		>
			<CheckoutForm />
		</Elements>
	);
};
