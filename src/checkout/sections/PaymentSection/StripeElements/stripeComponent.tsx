import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo } from "react";
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
	const [transactionInitializeResult, transactionInitialize] = useTransactionInitializeMutation();
	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	const stripeData = transactionInitializeResult.data?.transactionInitialize?.data as
		| undefined
		| {
				paymentIntent: {
					client_secret: string;
				};
				publishableKey: string;
		  };

	useEffect(() => {
		if (!isReadyForPayment) return;

		void (async () => {
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
				}
			} catch (err) {
				console.error(err);
				showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
			}
		})();
	}, [
		isReadyForPayment,
		checkout.id,
		commonErrorMessages.somethingWentWrong,
		showCustomErrors,
		transactionInitialize,
	]);

	const stripePromise = useMemo(
		() => stripeData?.publishableKey && loadStripe(stripeData.publishableKey),
		[stripeData],
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
