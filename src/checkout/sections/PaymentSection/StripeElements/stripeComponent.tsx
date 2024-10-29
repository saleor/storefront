import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { apiErrorMessages } from "../errorMessages";
import { CheckoutForm } from "./stripeElementsForm";
import { stripeGatewayId } from "./types";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts, type CustomError } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface StripeComponentProps {
	isReadyForPayment: boolean;
}

export const StripeComponent = ({ isReadyForPayment }: StripeComponentProps) => {
	const { checkout } = useCheckout();
	const [, transactionInitialize] = useTransactionInitializeMutation();
	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);
	const [stripeData, setStripeData] = useState<{
		paymentIntent: { client_secret: string };
		publishableKey: string;
	} | null>(null);

	const initializePaymentIntent = async () => {
		if (!isReadyForPayment) return null;

		try {
			const response = await transactionInitialize({
				checkoutId: checkout.id,
				paymentGateway: {
					id: stripeGatewayId,
					data: {
						automatic_payment_methods: {
							enabled: true,
						},
					},
				},
			});

			if (response.data?.transactionInitialize?.errors?.length) {
				showCustomErrors(response.data.transactionInitialize.errors as CustomError[]);
				return null;
			}

			const data = response.data?.transactionInitialize?.data as {
				paymentIntent: { client_secret: string };
				publishableKey: string;
			};

			setStripeData(data);
			return data;
		} catch (err) {
			console.error(err);
			showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
			return null;
		}
	};

	useEffect(() => {
		if (isReadyForPayment && !stripeData) {
			void initializePaymentIntent();
		}
	}, [isReadyForPayment]);

	const stripePromise = useMemo(
		() => stripeData?.publishableKey && loadStripe(stripeData.publishableKey),
		[stripeData]
	);

	if (!isReadyForPayment) {
		return (
			<div className="my-8 text-neutral-600">
				Please complete billing and shipping information before proceeding to payment.
			</div>
		);
	}

	if (!stripePromise || !stripeData) {
		return null;
	}

	return (
		<Elements
			options={{ clientSecret: stripeData.paymentIntent.client_secret, appearance: { theme: "stripe" } }}
			stripe={stripePromise}
		>
			<CheckoutForm />
		</Elements>
	);
};