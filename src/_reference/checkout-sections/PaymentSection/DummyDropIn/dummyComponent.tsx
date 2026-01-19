"use client";

import { dummyGatewayId } from "./types";
import { Button } from "@/ui/components/ui/button";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";

// Basic implementation of the test gateway:
// https://github.com/saleor/dummy-payment-app/

export const DummyComponent = () => {
	const { showCustomErrors } = useAlerts();

	const { checkout } = useCheckout();
	const [transactionInitializeState, transactionInitialize] = useTransactionInitializeMutation();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
	const isInProgress = completingCheckout || transactionInitializeState.fetching;

	const onInitalizeClick = () => {
		void transactionInitialize({
			checkoutId: checkout.id,
			paymentGateway: {
				id: dummyGatewayId,
				data: {
					event: {
						includePspReference: true,
						type: "CHARGE_SUCCESS",
					},
				},
			},
		})
			.catch((err) => {
				console.error("There was a problem with Dummy Payment Gateway:", err);
			})
			.then((_) => {
				return onCheckoutComplete();
			})
			.then((res) => {
				if (res?.apiErrors) {
					res.apiErrors.forEach((error) => {
						showCustomErrors([{ message: error.message }]);
					});
				}
			});
	};

	if (isInProgress) {
		return <Button disabled>Processing payment...</Button>;
	}

	return <Button onClick={onInitalizeClick}>Make payment and create order</Button>;
};
