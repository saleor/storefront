"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { type ParsedStripeGateway } from "../types";
import { apiErrorMessages } from "../errorMessages";
import { CheckoutForm } from "./stripeElementsForm";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";

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
	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	// Get the Stripe publishable key from the config
	const stripePublishableKey = config.data?.stripePublishableKey;

	const [transactionInitializeResult, transactionInitialize] = useTransactionInitializeMutation();
	const stripeData = transactionInitializeResult.data?.transactionInitialize?.data as
		| undefined
		| {
				paymentIntent: {
					client_secret: string;
				};
				publishableKey: string;
		  };

	const stripePromise = useMemo(
		() => stripePublishableKey && loadStripe(stripePublishableKey),
		[stripePublishableKey],
	);

	useEffect(() => {
		if (!checkout?.totalPrice?.gross?.amount) {
			return;
		}

		transactionInitialize({
			checkoutId: checkout.id,
			paymentGateway: {
				id: config.id,
				data: {
					// Send the amount and currency for payment intent creation
					amount: Math.round(checkout.totalPrice.gross.amount * 100), // Convert to cents
					currency: checkout.totalPrice.gross.currency.toLowerCase(),
				},
			},
		}).catch((err) => {
			console.error("Transaction initialize error:", err);
			showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
		});
	}, [
		checkout?.id,
		checkout?.totalPrice,
		config.id,
		transactionInitialize,
		showCustomErrors,
		commonErrorMessages.somethingWentWrong,
	]);

	if (!stripePromise || !stripePublishableKey) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">
					Stripe configuration is missing. Please check your payment gateway setup.
				</p>
			</div>
		);
	}

	if (!stripeData?.paymentIntent?.client_secret) {
		return (
			<div className="flex h-32 animate-pulse items-center justify-center rounded-md bg-gray-200">
				<span className="text-gray-500">Initializing payment...</span>
			</div>
		);
	}

	return (
		<Elements
			options={{
				clientSecret: stripeData.paymentIntent.client_secret,
				appearance: { theme: "stripe" },
			}}
			stripe={stripePromise}
		>
			<CheckoutForm />
		</Elements>
	);
};
