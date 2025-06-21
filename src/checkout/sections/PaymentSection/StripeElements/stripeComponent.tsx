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
	const [hasInitialized, setHasInitialized] = useState(false);

	// Parse the response data according to the Stripe app's actual response format
	const stripeData = transactionInitializeResult.data?.transactionInitialize?.data as
		| undefined
		| {
				paymentIntent: {
					stripeClientSecret: string;
					errors?: Array<{ code: string; message: string }>;
				};
		  };

	const stripePromise = useMemo(
		() => stripePublishableKey && loadStripe(stripePublishableKey),
		[stripePublishableKey],
	);

	// Function to initialize payment intent only when user clicks pay
	const initializePaymentIntent = async () => {
		if (hasInitialized || !checkout?.totalPrice?.gross?.amount) {
			return stripeData?.paymentIntent?.stripeClientSecret;
		}

		console.log("Stripe: Initializing transaction with:", {
			checkoutId: checkout.id,
			gatewayId: config.id,
			amount: Math.round(checkout.totalPrice.gross.amount * 100),
			currency: checkout.totalPrice.gross.currency.toLowerCase(),
		});

		setHasInitialized(true);

		try {
			const result = await transactionInitialize({
				checkoutId: checkout.id,
				paymentGateway: {
					id: config.id,
					data: {
						paymentIntent: {
							paymentMethod: "card",
						},
					},
				},
			});

			const resultData = result.data?.transactionInitialize?.data as
				| undefined
				| {
						paymentIntent: {
							stripeClientSecret: string;
							errors?: Array<{ code: string; message: string }>;
						};
				  };

			return resultData?.paymentIntent?.stripeClientSecret;
		} catch (err) {
			console.error("Transaction initialize error:", err);
			setHasInitialized(false); // Reset on error so user can retry
			showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
			throw err;
		}
	};

	// Debug the transaction result
	useEffect(() => {
		if (transactionInitializeResult.data?.transactionInitialize) {
			console.log(
				"Stripe: Transaction initialize result:",
				transactionInitializeResult.data.transactionInitialize,
			);
			console.log("Stripe: Raw data object:", transactionInitializeResult.data.transactionInitialize.data);
			console.log("Stripe: Parsed stripeData:", stripeData);
			console.log(
				"Stripe: Transaction errors:",
				transactionInitializeResult.data.transactionInitialize.errors,
			);
			console.log(
				"Stripe: Transaction event:",
				transactionInitializeResult.data.transactionInitialize.transactionEvent,
			);
		}
		if (transactionInitializeResult.error) {
			console.error("Stripe: Transaction initialize error:", transactionInitializeResult.error);
		}
	}, [transactionInitializeResult, stripeData]);

	if (!stripePromise || !stripePublishableKey) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">
					Stripe configuration is missing. Please check your payment gateway setup.
				</p>
			</div>
		);
	}

	// Show errors if the payment intent has errors
	if (stripeData?.paymentIntent?.errors?.length) {
		return (
			<div className="rounded border border-red-300 bg-red-50 p-4">
				<p className="text-red-800">Payment initialization failed:</p>
				<ul className="mt-2 list-disc pl-5">
					{stripeData.paymentIntent.errors.map((error, index) => (
						<li key={index} className="text-red-700">
							{error.message}
						</li>
					))}
				</ul>
			</div>
		);
	}

	// Render the payment form without requiring a client secret upfront
	// The payment intent will be created when the user clicks "Pay"
	return (
		<Elements
			options={{
				mode: "payment",
				amount: Math.round((checkout?.totalPrice?.gross?.amount || 0) * 100),
				currency: checkout?.totalPrice?.gross?.currency?.toLowerCase() || "usd",
				appearance: { theme: "stripe" },
			}}
			stripe={stripePromise}
		>
			<CheckoutForm initializePaymentIntent={initializePaymentIntent} />
		</Elements>
	);
};
