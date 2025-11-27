import { useEffect, useRef } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useTransactionProcessMutation } from "@/checkout/graphql";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const useCheckoutCompleteRedirect = () => {
	const stripe = useStripe();
	const { completingCheckout, onCheckoutComplete } = useCheckoutComplete();
	const [{ fetching: processingTransaction }, transactionProcess] = useTransactionProcessMutation();
	const isProcessingRef = useRef(false);

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment, transaction } = getQueryParams();

		// Check if we're returning from a Stripe redirect
		if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
			return;
		}

		if (!stripe) {
			return;
		}

		// Prevent multiple executions
		if (isProcessingRef.current || completingCheckout || processingTransaction) {
			return;
		}

		const transactionId = sessionStorage.getItem("transactionId");
		const transactionIdFromQuery = typeof transaction === "string" ? transaction : undefined;
		const resolvedTransactionId = transactionId ?? transactionIdFromQuery;

		if (!resolvedTransactionId) {
			console.error("Missing transactionId in sessionStorage and query params after Stripe redirect", {
				transaction,
			});
			return;
		}

		isProcessingRef.current = true;

		const processAndComplete = async () => {
			try {
				// First, sync Saleor with Stripe's payment status via transactionProcess
				const processResult = await transactionProcess({ id: resolvedTransactionId });

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

				type TransactionProcessData = {
					paymentIntent?: {
						stripeClientSecret?: string;
					};
				};

				const processData = processResult.data?.transactionProcess?.data as
					| TransactionProcessData
					| undefined;

				const serverClientSecret = processData?.paymentIntent?.stripeClientSecret;

				if (serverClientSecret) {
					const intentResult = await stripe.retrievePaymentIntent(serverClientSecret);

					if (intentResult.error) {
						console.error("Unable to retrieve PaymentIntent:", intentResult.error);
					} else {
						console.info("Retrieved PaymentIntent status:", intentResult.paymentIntent?.status);
					}
				}

				// Clear transaction identifier once we finalize
				sessionStorage.removeItem("transactionId");

				// Now complete the checkout
				await onCheckoutComplete();
			} catch (error) {
				console.error("Error during checkout completion:", error);
				isProcessingRef.current = false;
			}
		};

		void processAndComplete();
	}, [completingCheckout, onCheckoutComplete, processingTransaction, transactionProcess, stripe]);
};
