/**
 * Improved Stripe Checkout Form
 *
 * Implements the complete payment flow with:
 * - Proper payment confirmation
 * - Transaction process session handling
 * - Checkout completion
 * - Error handling and recovery
 */

import { type FormEventHandler, useEffect, useState, useRef, useCallback } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { usePaymentProcessingScreen } from "../PaymentProcessingScreen";
import { getUrlForTransactionInitialize } from "../utils";
import { StripePaymentManager } from "./stripePaymentManager";
import { useTransactionProcessMutation } from "@/checkout/graphql";
import {
	useCheckoutValidationActions,
	useCheckoutValidationState,
	anyFormsValidating,
	areAllFormsValid,
} from "@/checkout/state/checkoutValidationStateStore";
import {
	useCheckoutUpdateState,
	useCheckoutUpdateStateActions,
	areAnyRequestsInProgress,
	hasFinishedApiChangesWithNoError,
} from "@/checkout/state/updateStateStore";
import { useEvent } from "@/checkout/hooks/useEvent";
import { useUser } from "@/checkout/hooks/useUser";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { getQueryParams } from "@/checkout/lib/utils/url";

const paymentElementOptions: StripePaymentElementOptions = {
	layout: "tabs",
	fields: {
		billingDetails: "never", // We handle billing details separately
	},
	// Enable automatic payment methods as per Stripe app documentation
	paymentMethodOrder: ["card", "apple_pay", "google_pay"],
};

export function StripeCheckoutForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [paymentError, setPaymentError] = useState<string | null>(null);

	const stripe = useStripe();
	const elements = useElements();
	const { checkout } = useCheckout();

	// Prevent duplicate payment processing
	const paymentProcessingRef = useRef(false);
	const paymentManager = StripePaymentManager.getInstance();

	const [, transactionProcess] = useTransactionProcessMutation();

	const { authenticated } = useUser();
	const { showCustomErrors } = useAlerts();

	const checkoutUpdateState = useCheckoutUpdateState();
	const anyRequestsInProgress = areAnyRequestsInProgress(checkoutUpdateState);
	const finishedApiChangesWithNoError = hasFinishedApiChangesWithNoError(checkoutUpdateState);
	const { setSubmitInProgress, setShouldRegisterUser } = useCheckoutUpdateStateActions();
	const { validateAllForms } = useCheckoutValidationActions();
	const { validationState } = useCheckoutValidationState();

	const { setIsProcessingPayment } = usePaymentProcessingScreen();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	// Handle redirected payment (when user returns from external payment flow)
	useEffect(() => {
		const handleRedirectedPayment = async () => {
			const { paymentIntent, paymentIntentClientSecret, processingPayment } = getQueryParams();

			if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
				return;
			}

			console.log("StripeCheckoutForm: Handling redirected payment", {
				paymentIntent,
				hasClientSecret: !!paymentIntentClientSecret,
			});

			// Process the redirected payment
			if (!completingCheckout) {
				setIsProcessingPayment(true);

				try {
					// First, process the transaction to update Saleor with latest status
					const session = paymentManager.getSession(checkout.id);
					if (session?.transactionId) {
						console.log("StripeCheckoutForm: Processing transaction after redirect");

						const processResult = await transactionProcess({
							id: session.transactionId,
							data: null,
						});

						if (processResult.error || processResult.data?.transactionProcess?.errors?.length) {
							console.error("StripeCheckoutForm: Transaction process failed", processResult);
							throw new Error("Failed to process payment status");
						}
					}

					// Complete the checkout
					await onCheckoutComplete();
				} catch (error) {
					console.error("StripeCheckoutForm: Failed to complete redirected payment", error);
					setIsProcessingPayment(false);
					showCustomErrors([
						{
							message: "Failed to complete payment. Please try again.",
						},
					]);
				}
			}
		};

		void handleRedirectedPayment();
	}, [
		checkout.id,
		completingCheckout,
		onCheckoutComplete,
		paymentManager,
		transactionProcess,
		setIsProcessingPayment,
		showCustomErrors,
	]);

	// Handle form submission (initiate payment)
	const onSubmitInitialize: FormEventHandler<HTMLFormElement> = useEvent(async (e) => {
		e.preventDefault();

		if (paymentProcessingRef.current) {
			console.log("StripeCheckoutForm: Payment already processing, ignoring submit");
			return;
		}

		console.log("StripeCheckoutForm: Starting payment submission");

		setIsLoading(true);
		setPaymentError(null);

		// Trigger validation for all forms
		validateAllForms(authenticated, checkout?.isShippingRequired ?? true);
		setShouldRegisterUser(true);
		setSubmitInProgress(true);
	});

	// Process payment after validation is complete
	const processPayment = useCallback(async () => {
		if (paymentProcessingRef.current) {
			console.log("StripeCheckoutForm: Payment already processing, skipping duplicate call");
			return;
		}

		paymentProcessingRef.current = true;
		setIsLoading(true);
		setIsProcessingPayment(true);

		try {
			if (!stripe || !elements) {
				throw new Error("Stripe not loaded");
			}

			console.log("StripeCheckoutForm: Confirming payment with Stripe");

			// Get the current session to include in return URL
			const session = paymentManager.getSession(checkout.id);
			const returnUrl = new URL(getUrlForTransactionInitialize().newUrl);

			// Add transaction ID to return URL for processing
			if (session?.transactionId) {
				returnUrl.searchParams.set("transactionId", session.transactionId);
			}
			if (session?.paymentIntentId) {
				returnUrl.searchParams.set("paymentIntent", session.paymentIntentId);
			}

			// Confirm payment with Stripe
			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl.toString(),
					payment_method_data: {
						billing_details: {
							name: `${checkout.billingAddress?.firstName || ""} ${
								checkout.billingAddress?.lastName || ""
							}`.trim(),
							email: checkout.email || "",
							phone: checkout.billingAddress?.phone || "",
							address: {
								city: checkout.billingAddress?.city || "",
								country: checkout.billingAddress?.country.code || "",
								line1: checkout.billingAddress?.streetAddress1 || "",
								line2: checkout.billingAddress?.streetAddress2 || "",
								postal_code: checkout.billingAddress?.postalCode || "",
								state: checkout.billingAddress?.countryArea || "",
							},
						},
					},
				},
				redirect: "if_required", // Only redirect if necessary (e.g., 3D Secure)
			});

			if (result.error) {
				// Payment failed
				setIsProcessingPayment(false);
				paymentProcessingRef.current = false;

				const errorMessage = result.error.message || "Payment failed";
				setPaymentError(errorMessage);

				if (result.error.type === "card_error" || result.error.type === "validation_error") {
					showCustomErrors([{ message: errorMessage }]);
				} else {
					showCustomErrors([{ message: "An unexpected error occurred during payment." }]);
				}
				return;
			}

			// Payment successful or requires further action
			if (result.paymentIntent) {
				console.log("StripeCheckoutForm: Payment confirmed", {
					status: result.paymentIntent.status,
					id: result.paymentIntent.id,
				});

				// For successful payments that don't require redirect, process immediately
				if (result.paymentIntent.status === "succeeded" || result.paymentIntent.status === "processing") {
					try {
						// Process transaction to update Saleor
						if (session?.transactionId) {
							console.log("StripeCheckoutForm: Processing transaction after successful payment");

							const processResult = await transactionProcess({
								id: session.transactionId,
								data: null,
							});

							if (processResult.error || processResult.data?.transactionProcess?.errors?.length) {
								console.error("StripeCheckoutForm: Transaction process failed", processResult);
								throw new Error("Failed to process payment status");
							}
						}

						// Complete checkout
						await onCheckoutComplete();

						// Clear the session after successful completion
						paymentManager.clearSession(checkout.id);

						return;
					} catch (error) {
						console.error("StripeCheckoutForm: Failed to complete payment", error);
						setIsProcessingPayment(false);
						paymentProcessingRef.current = false;
						showCustomErrors([
							{
								message: "Payment was successful but checkout completion failed. Please contact support.",
							},
						]);
						return;
					}
				}
			}

			// If we reach here, payment might require redirect or further action
			// Stripe will handle redirects automatically
			console.log("StripeCheckoutForm: Payment requires further action or redirect");
		} catch (err) {
			console.error("StripeCheckoutForm: Payment processing error:", err);
			setIsProcessingPayment(false);
			paymentProcessingRef.current = false;

			const errorMessage =
				err instanceof Error ? err.message : "An unexpected error occurred during payment processing.";
			setPaymentError(errorMessage);
			showCustomErrors([{ message: errorMessage }]);
		} finally {
			setIsLoading(false);
		}
	}, [
		stripe,
		elements,
		checkout.id,
		checkout.billingAddress,
		checkout.email,
		paymentManager,
		transactionProcess,
		onCheckoutComplete,
		setIsProcessingPayment,
		showCustomErrors,
	]);

	// Handle when submission is ready to process payment
	useEffect(() => {
		const validating = anyFormsValidating(validationState);
		const allFormsValid = areAllFormsValid(validationState);

		if (!checkoutUpdateState.submitInProgress || validating || anyRequestsInProgress) {
			return;
		}

		if (!stripe || !elements) {
			console.log("StripeCheckoutForm: Stripe not ready, waiting...");
			return;
		}

		// Submit was finished - mark it as complete
		setSubmitInProgress(false);

		// Check if there were errors in validation or other requests
		if (!finishedApiChangesWithNoError || !allFormsValid) {
			setIsLoading(false);
			console.log("StripeCheckoutForm: Form validation or API errors, stopping submission");
			return;
		}

		// All good - process the payment
		console.log("StripeCheckoutForm: All validations passed, processing payment");
		void processPayment();
	}, [
		anyRequestsInProgress,
		checkoutUpdateState.submitInProgress,
		finishedApiChangesWithNoError,
		processPayment,
		setSubmitInProgress,
		stripe,
		elements,
		validationState,
	]);

	const isFormDisabled = isLoading || !stripe || !elements || paymentProcessingRef.current;

	return (
		<form className="my-8 flex flex-col gap-y-6" onSubmit={onSubmitInitialize}>
			<PaymentElement className="payment-element" options={paymentElementOptions} />

			{paymentError && (
				<div className="rounded-md border border-red-200 bg-red-50 p-3">
					<p className="text-sm text-red-800">{paymentError}</p>
				</div>
			)}

			<button
				type="submit"
				className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
				disabled={isFormDisabled}
				aria-disabled={isFormDisabled}
				id="submit"
			>
				<span className="button-text">{isLoading ? <Loader /> : "Pay now"}</span>
			</button>

			{/* Debug info in development */}
			{process.env.NODE_ENV === "development" && (
				<details className="text-xs text-gray-500">
					<summary>Debug Info</summary>
					<pre>
						{JSON.stringify(
							{
								isLoading,
								hasStripe: !!stripe,
								hasElements: !!elements,
								paymentProcessing: paymentProcessingRef.current,
								session: paymentManager.getSession(checkout.id),
								debugInfo: paymentManager.getDebugInfo(),
							},
							null,
							2,
						)}
					</pre>
				</details>
			)}
		</form>
	);
}

function Loader() {
	return (
		<div className="text-center" aria-busy="true" role="status">
			<div>
				<svg
					aria-hidden="true"
					className="mr-2 inline h-6 w-6 animate-spin fill-neutral-600 text-neutral-100 dark:text-neutral-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
