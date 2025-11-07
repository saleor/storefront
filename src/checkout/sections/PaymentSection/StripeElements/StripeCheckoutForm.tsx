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
import { useMutation, gql } from "urql";
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
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";

const UPDATE_METADATA_MUTATION = gql`
	mutation UpdateCheckoutMetadata($id: ID!, $input: [MetadataInput!]!) {
		updateMetadata(id: $id, input: $input) {
			errors {
				field
				message
			}
			item {
				... on Checkout {
					id
				}
			}
		}
	}
`;

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

	// Prevent duplicate payment processing and track mounted state
	const paymentProcessingRef = useRef(false);
	const isMountedRef = useRef(true);
	const paymentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const paymentManager = StripePaymentManager.getInstance();

	const [, transactionProcess] = useTransactionProcessMutation();
	const [, updateMetadata] = useMutation(UPDATE_METADATA_MUTATION);
	const { cortexData } = useCortexDataStore();

	const { authenticated } = useUser();
	const { showCustomErrors } = useAlerts();

	const checkoutUpdateState = useCheckoutUpdateState();
	const anyRequestsInProgress = areAnyRequestsInProgress(checkoutUpdateState);
	const finishedApiChangesWithNoError = hasFinishedApiChangesWithNoError(checkoutUpdateState);
	const { setSubmitInProgress, setShouldRegisterUser } = useCheckoutUpdateStateActions();
	const { validateAllForms, setValidationState } = useCheckoutValidationActions();
	const { validationState } = useCheckoutValidationState();

	const { setIsProcessingPayment } = usePaymentProcessingScreen();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	// Cleanup function to reset all payment states
	const resetPaymentStates = useCallback(() => {
		if (!isMountedRef.current) return;

		paymentProcessingRef.current = false;
		setIsLoading(false);
		setIsProcessingPayment(false);
		setSubmitInProgress(false);

		// Clear any pending timeouts
		if (paymentTimeoutRef.current) {
			clearTimeout(paymentTimeoutRef.current);
			paymentTimeoutRef.current = null;
		}
	}, [setIsProcessingPayment, setSubmitInProgress]);

	// Cleanup on unmount
	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;

			// Clean up any pending timeouts
			if (paymentTimeoutRef.current) {
				clearTimeout(paymentTimeoutRef.current);
			}

			// Reset processing states if component unmounts during payment
			// This ensures state is clean when user navigates away from checkout
			if (paymentProcessingRef.current) {
				setIsProcessingPayment(false);
				setSubmitInProgress(false);
			}
		};
	}, [setIsProcessingPayment, setSubmitInProgress]);

	// Handle redirected payment (when user returns from external payment flow like PayPal)
	useEffect(() => {
		const handleRedirectedPayment = async () => {
			const { paymentIntent, paymentIntentClientSecret, processingPayment } = getQueryParams();

			// Check if this is a redirect from payment provider
			if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
				return;
			}

			console.warn("[REDIRECT] Detected redirect from payment provider", {
				paymentIntent,
				hasClientSecret: !!paymentIntentClientSecret,
				processingPayment,
				hasStripe: !!stripe,
				isProcessing: paymentProcessingRef.current,
				completingCheckout,
			});

			// Wait for Stripe.js to load
			if (!stripe) {
				console.warn("[REDIRECT] Waiting for Stripe.js to load before processing redirect...");
				// Show processing screen while waiting
				if (!paymentProcessingRef.current) {
					setIsProcessingPayment(true);
				}
				return;
			}

			// Prevent duplicate processing
			if (paymentProcessingRef.current || completingCheckout) {
				console.warn("[REDIRECT] Already processing, skipping duplicate", {
					paymentProcessingRef: paymentProcessingRef.current,
					completingCheckout,
				});
				return;
			}

			console.warn("[REDIRECT] Starting redirect payment processing");

			// Mark as processing
			paymentProcessingRef.current = true;
			setIsProcessingPayment(true);

			// Set timeout for redirect handling
			paymentTimeoutRef.current = setTimeout(() => {
				if (isMountedRef.current && paymentProcessingRef.current) {
					console.error("StripeCheckoutForm: Redirected payment timeout after 30 seconds");
					resetPaymentStates();
					showCustomErrors([
						{
							message:
								"Payment verification is taking too long. Please check your order history or contact support.",
						},
					]);
				}
			}, 30000);

			try {
				// CRITICAL: Retrieve the payment intent from Stripe to get latest status
				console.warn("[REDIRECT] Retrieving payment intent status from Stripe");
				const { paymentIntent: retrievedPaymentIntent, error: retrieveError } =
					await stripe.retrievePaymentIntent(paymentIntentClientSecret);

				if (retrieveError) {
					console.error("[REDIRECT] Failed to retrieve payment intent", retrieveError);
					throw new Error(retrieveError.message || "Failed to retrieve payment status");
				}

				if (!retrievedPaymentIntent) {
					throw new Error("Payment intent not found");
				}

				console.warn("[REDIRECT] Payment intent status:", retrievedPaymentIntent.status);

				// Check if payment was successful
				if (
					retrievedPaymentIntent.status !== "succeeded" &&
					retrievedPaymentIntent.status !== "processing"
				) {
					throw new Error(`Payment ${retrievedPaymentIntent.status}. Please try again.`);
				}

				// Get the transaction ID from session
				const session = paymentManager.getSession(checkout.id);

				if (!session?.transactionId) {
					console.error("[REDIRECT] No transaction ID found in session", session);
					throw new Error("Transaction ID not found. Please contact support.");
				}

				console.warn("[REDIRECT] Processing transaction after redirect");

				// Process the transaction to update Saleor with payment status
				const processResult = await transactionProcess({
					id: session.transactionId,
					data: null,
				});

				if (processResult.error || processResult.data?.transactionProcess?.errors?.length) {
					console.error("[REDIRECT] Transaction process failed", processResult);
					throw new Error("Failed to process payment status");
				}

				console.warn("[REDIRECT] Calling onCheckoutComplete to create order");

				// Complete the checkout
				await onCheckoutComplete();

				console.warn("[REDIRECT] onCheckoutComplete finished, should redirect automatically");

				// Clear timeout on success
				if (paymentTimeoutRef.current) {
					clearTimeout(paymentTimeoutRef.current);
					paymentTimeoutRef.current = null;
				}

				// Clear session after successful completion
				paymentManager.clearSession(checkout.id);

				// NOTE: onCheckoutComplete should redirect automatically via window.location.href
				// If we reach here and are still mounted after 3 seconds, redirect failed
				setTimeout(() => {
					if (isMountedRef.current) {
						console.error(
							"StripeCheckoutForm: Still mounted after 3 seconds - redirect may have failed. Forcing redirect to home.",
						);
						// Force redirect to home page (order confirmation should show there)
						window.location.href = "/";
					}
				}, 3000);
			} catch (error) {
				console.error("StripeCheckoutForm: Failed to complete redirected payment", error);
				resetPaymentStates();
				showCustomErrors([
					{
						message:
							error instanceof Error ? error.message : "Failed to complete payment. Please try again.",
					},
				]);
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
		resetPaymentStates,
		stripe, // Add stripe as dependency so effect re-runs when Stripe.js loads
	]);

	// Validation watchdog: Fix stuck validation for scopes that shouldn't validate
	// For digital products (no shipping required), shippingAddress validation never completes
	// because the component is never mounted. This watchdog detects and fixes that.
	useEffect(() => {
		const isShippingRequired = checkout?.isShippingRequired ?? true;

		console.log("[VALIDATION WATCHDOG] Checking state:", {
			isShippingRequired,
			shippingAddressState: validationState.shippingAddress,
			authenticated,
			checkoutId: checkout?.id,
		});

		// If shipping is not required and shippingAddress is stuck in "validating",
		// automatically set it to "valid" to prevent soft-lock
		if (!isShippingRequired && validationState.shippingAddress === "validating") {
			console.warn(
				"[VALIDATION WATCHDOG] Shipping not required but shippingAddress stuck in validating, fixing...",
				{
					authenticated,
					validationState,
				}
			);
			setValidationState("shippingAddress", "valid");
		}
	}, [checkout?.isShippingRequired, validationState.shippingAddress, setValidationState, authenticated, validationState, checkout?.id]);

	// Handle form submission (initiate payment)
	const onSubmitInitialize: FormEventHandler<HTMLFormElement> = useEvent(async (e) => {
		e.preventDefault();

		if (paymentProcessingRef.current) {
			console.warn("StripeCheckoutForm: Payment already processing, ignoring submit");
			return;
		}

		console.warn("StripeCheckoutForm: Starting payment submission");

		setIsLoading(true);
		setPaymentError(null);

		// Trigger validation for all forms
		validateAllForms(authenticated, checkout?.isShippingRequired ?? true);
		setShouldRegisterUser(true);
		setSubmitInProgress(true);
	});

	// Process payment after validation is complete
	const processPayment = useCallback(async () => {
		// Guard against duplicate calls
		if (paymentProcessingRef.current) {
			console.warn("StripeCheckoutForm: Payment already processing, skipping duplicate call");
			return;
		}

		// Guard against race conditions - verify no requests are in progress
		const currentRequestsInProgress = areAnyRequestsInProgress(checkoutUpdateState);
		if (currentRequestsInProgress) {
			console.warn("StripeCheckoutForm: Other requests still in progress, aborting payment");
			setIsLoading(false);
			return;
		}

		// Guard against invalid validation state
		const currentlyValidating = anyFormsValidating(validationState);
		const currentFormsValid = areAllFormsValid(validationState);
		if (currentlyValidating || !currentFormsValid) {
			console.warn("StripeCheckoutForm: Forms invalid or still validating, aborting payment");
			setIsLoading(false);
			return;
		}

		paymentProcessingRef.current = true;
		setIsLoading(true);
		setIsProcessingPayment(true);

		try {
			if (!stripe || !elements) {
				throw new Error("Stripe not loaded");
			}

			// Start metadata update in parallel (fire-and-forget)
			// Don't await - let it happen in background so Elements stay valid
			// The backup in checkoutComplete will ensure it's set even if this is slow
			if (cortexData && (cortexData.cortexCloudUsername || cortexData.cortexFollowConfirmed)) {
				console.warn("[PAYMENT] Starting Cortex metadata update (non-blocking)", {
					cortexCloudUsername: cortexData.cortexCloudUsername,
					cortexFollowConfirmed: cortexData.cortexFollowConfirmed,
				});

				updateMetadata({
					id: checkout.id,
					input: [
						{
							key: "cortexCloudUsername",
							value: cortexData.cortexCloudUsername || "",
						},
						{
							key: "cortexFollowConfirmed",
							value: cortexData.cortexFollowConfirmed ? "true" : "false",
						},
					],
				})
					.then(() => {
						console.warn("[PAYMENT] Cortex metadata updated successfully (background)");
					})
					.catch((error) => {
						console.error("[PAYMENT] Background metadata update failed (will retry in checkoutComplete):", error);
					});
			} else {
				console.warn("[PAYMENT] No Cortex data to update");
			}

			console.warn("[PAYMENT] Confirming payment with Stripe");

			// Get the current session to include in return URL
			const session = paymentManager.getSession(checkout.id);
			const returnUrl = new URL(getUrlForTransactionInitialize().newUrl);

			// CRITICAL: Add processingPayment flag so redirect handler knows to activate
			// Stripe will automatically add payment_intent and payment_intent_client_secret
			returnUrl.searchParams.set("processingPayment", "true");

			// Add transaction ID and publishable key to return URL for processing after redirect
			if (session?.transactionId) {
				returnUrl.searchParams.set("transactionId", session.transactionId);
			}
			if (session?.paymentIntentId) {
				returnUrl.searchParams.set("paymentIntent", session.paymentIntentId);
			}
			if (session?.publishableKey) {
				returnUrl.searchParams.set("stripe_publishable_key", session.publishableKey);
			}

			console.warn("[PAYMENT] Return URL for redirect:", returnUrl.toString());
			console.warn("[PAYMENT] About to call stripe.confirmPayment");

			// Confirm payment with Stripe
			// Using redirect: "always" so that Stripe always redirects on success,
			// and we handle the result via PaymentRedirectHandler after the redirect
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
				redirect: "always", // Always redirect so we can handle result consistently via return_url
			});

			// NOTE: With redirect: "always", this code only runs if there's an error.
			// On success, Stripe redirects and the page reloads, so this never executes.
			console.warn("[PAYMENT] stripe.confirmPayment returned (error or unexpected scenario)", {
				hasError: !!result.error,
				errorType: result.error?.type,
				errorMessage: result.error?.message,
				hasPaymentIntent: !!(result as any).paymentIntent,
				paymentIntentStatus: (result as any).paymentIntent?.status,
				paymentIntentId: (result as any).paymentIntent?.id,
				resultKeys: Object.keys(result),
			});

			if (result.error) {
				// Payment failed - reset all states
				resetPaymentStates();

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
			if ((result as any).paymentIntent) {
				const paymentIntent = (result as any).paymentIntent;
				console.warn("[PAYMENT] Payment confirmed", {
					status: paymentIntent.status,
					id: paymentIntent.id,
				});

				// For successful payments that don't require redirect, process immediately
				if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
					console.warn("[PAYMENT] Payment succeeded, preparing to complete checkout", {
						status: paymentIntent.status,
						hasSession: !!session,
						transactionId: session?.transactionId,
					});
					// Set a timeout to prevent infinite waiting
					paymentTimeoutRef.current = setTimeout(() => {
						if (isMountedRef.current && paymentProcessingRef.current) {
							console.error("StripeCheckoutForm: Payment completion timeout after 30 seconds");
							resetPaymentStates();
							showCustomErrors([
								{
									message:
										"Payment completion is taking too long. Please check your order history or contact support.",
								},
							]);
						}
					}, 30000); // 30 second timeout

					try {
						// Process transaction to update Saleor
						if (session?.transactionId) {
							console.warn("[PAYMENT] Processing transaction after successful payment");

							const processResult = await transactionProcess({
								id: session.transactionId,
								data: null,
							});

							console.warn("[PAYMENT] Transaction process result", {
								hasError: !!processResult.error,
								errorMessage: processResult.error?.message,
								hasData: !!processResult.data,
								errors: processResult.data?.transactionProcess?.errors,
							});

							if (processResult.error || processResult.data?.transactionProcess?.errors?.length) {
								console.error("StripeCheckoutForm: Transaction process failed", processResult);
								throw new Error("Failed to process payment status");
							}
						} else {
							console.warn("[PAYMENT] No transaction ID in session, skipping transactionProcess", {
								hasSession: !!session,
								sessionKeys: session ? Object.keys(session) : [],
							});
						}

						console.warn("[PAYMENT] Calling onCheckoutComplete to create order");

						// Complete checkout
						await onCheckoutComplete();

						console.warn("[PAYMENT] onCheckoutComplete returned successfully");

						// Clear the session after successful completion
						paymentManager.clearSession(checkout.id);

						// Clear timeout since completion succeeded
						if (paymentTimeoutRef.current) {
							clearTimeout(paymentTimeoutRef.current);
							paymentTimeoutRef.current = null;
						}

						// Note: We don't reset states here because the page will redirect
						// If redirect fails, the timeout above will handle cleanup

						return;
					} catch (error) {
						console.error("StripeCheckoutForm: Failed to complete payment", error);
						resetPaymentStates();
						showCustomErrors([
							{
								message: "Payment was successful but checkout completion failed. Please contact support.",
							},
						]);
						return;
					}
				} else {
					console.warn("[PAYMENT] Payment intent status not succeeded/processing", {
						status: paymentIntent.status,
						requiresAction: paymentIntent.status === "requires_action",
					});
				}
			} else {
				console.warn("[PAYMENT] No paymentIntent in result", {
					hasError: !!result.error,
					resultKeys: Object.keys(result),
				});
			}

			// If we reach here, payment might require redirect or further action
			// Stripe will handle redirects automatically
			console.warn("[PAYMENT] Payment requires further action or redirect - ending processing");
			resetPaymentStates();
		} catch (err) {
			console.error("StripeCheckoutForm: Payment processing error:", err);
			resetPaymentStates();

			const errorMessage =
				err instanceof Error ? err.message : "An unexpected error occurred during payment processing.";

			// Don't show unhelpful Stripe internal errors to users
			const isStripeElementError = errorMessage.toLowerCase().includes("element") &&
				(errorMessage.toLowerCase().includes("not found") ||
				 errorMessage.toLowerCase().includes("not mounted") ||
				 errorMessage.toLowerCase().includes("has not been mounted"));

			if (!isStripeElementError) {
				setPaymentError(errorMessage);
				showCustomErrors([{ message: errorMessage }]);
			} else {
				console.warn("[PAYMENT] Suppressing unhelpful Stripe element error from user display");
			}
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
		resetPaymentStates,
		checkoutUpdateState,
		validationState,
		updateMetadata,
		cortexData,
	]);

	// Handle when submission is ready to process payment
	useEffect(() => {
		const validating = anyFormsValidating(validationState);
		const allFormsValid = areAllFormsValid(validationState);

		// Always log validation state to diagnose issues
		if (checkoutUpdateState.submitInProgress) {
			console.warn("[VALIDATION] Checking readiness:", {
				submitInProgress: checkoutUpdateState.submitInProgress,
				validating,
				allFormsValid,
				anyRequestsInProgress,
				hasStripe: !!stripe,
				hasElements: !!elements,
				finishedApiChangesWithNoError,
				validationState, // Log the full validation state
			});
		}

		if (!checkoutUpdateState.submitInProgress || validating || anyRequestsInProgress) {
			return;
		}

		if (!stripe || !elements) {
			console.warn("StripeCheckoutForm: Stripe not ready, waiting...");
			return;
		}

		// Submit was finished - mark it as complete
		setSubmitInProgress(false);

		// Check if there were errors in validation or other requests
		if (!finishedApiChangesWithNoError || !allFormsValid) {
			setIsLoading(false);
			console.warn("StripeCheckoutForm: Form validation or API errors, stopping submission", {
				finishedApiChangesWithNoError,
				allFormsValid,
				validationState,
			});
			return;
		}

		// All good - process the payment
		console.warn("[PAYMENT] All validations passed, processing payment");
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

	// Determine button state and message
	const getButtonState = () => {
		if (isLoading) {
			return { disabled: true, text: <Loader />, tooltip: null };
		}
		if (!stripe || !elements) {
			return { disabled: true, text: "Loading payment methods...", tooltip: null };
		}
		if (paymentProcessingRef.current) {
			return { disabled: true, text: "Processing...", tooltip: null };
		}
		return { disabled: false, text: "Pay now", tooltip: null };
	};

	const buttonState = getButtonState();

	return (
		<form className="my-8 flex flex-col gap-y-6" onSubmit={onSubmitInitialize}>
			<PaymentElement className="payment-element" options={paymentElementOptions} />

			{paymentError && (
				<div className="rounded-md border border-red-700 bg-red-950 p-4">
					<div className="flex items-start gap-3">
						<svg
							className="h-5 w-5 flex-shrink-0 text-red-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className="flex-1">
							<h4 className="text-sm font-semibold text-red-200">Payment Error</h4>
							<p className="mt-1 text-sm text-red-300">{paymentError}</p>
						</div>
					</div>
				</div>
			)}

			<div className="relative">
				<button
					type="submit"
					className="h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
					disabled={buttonState.disabled}
					aria-disabled={buttonState.disabled}
					title={buttonState.tooltip || undefined}
					id="submit"
				>
					<span className="button-text">{buttonState.text}</span>
				</button>
			</div>

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
