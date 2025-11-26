import { useEffect, useRef } from "react";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useTransactionProcessMutation } from "@/checkout/graphql";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const useCheckoutCompleteRedirect = () => {
	const { completingCheckout, onCheckoutComplete } = useCheckoutComplete();
	const [{ fetching: processingTransaction }, transactionProcess] = useTransactionProcessMutation();
	const isProcessingRef = useRef(false);

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment } = getQueryParams();

		// Check if we're returning from a Stripe redirect
		if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
			return;
		}

		// Prevent multiple executions
		if (isProcessingRef.current || completingCheckout || processingTransaction) {
			return;
		}

		const transactionId = sessionStorage.getItem("transactionId");

		if (!transactionId) {
			console.error("Missing transactionId in sessionStorage after Stripe redirect");
			return;
		}

		isProcessingRef.current = true;

		const processAndComplete = async () => {
			try {
				// First, sync Saleor with Stripe's payment status via transactionProcess
				const processResult = await transactionProcess({ id: transactionId });

				if (processResult.error) {
					console.error("Transaction process failed:", processResult.error);
					isProcessingRef.current = false;
					return;
				}

				const processErrors = processResult.data?.transactionProcess?.errors;
				if (processErrors?.length) {
					console.error("Transaction process errors:", processErrors);
					isProcessingRef.current = false;
					return;
				}

				// Clear session storage after successful processing
				sessionStorage.removeItem("transactionId");
				sessionStorage.removeItem("clientSecret");

				// Now complete the checkout
				await onCheckoutComplete();
			} catch (error) {
				console.error("Error during checkout completion:", error);
				isProcessingRef.current = false;
			}
		};

		void processAndComplete();
	}, [completingCheckout, onCheckoutComplete, processingTransaction, transactionProcess]);
};
