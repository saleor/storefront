"use client";

import { useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { StripePaymentManager } from "./StripeElements/stripePaymentManager";
import { useTransactionProcessMutation } from "@/checkout/graphql";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";
import { CheckoutSkeleton } from "@/checkout/views/Checkout";
import { PaymentProcessingScreen } from "./PaymentProcessingScreen";

/**
 * Handles payment redirects from external payment providers (like PayPal via Stripe)
 * This component processes the payment when user returns from PayPal
 *
 * IMPORTANT: This component does NOT use useCheckout() because the checkout might
 * already be converted to an order by the webhook. Instead, we rely on:
 * 1. Query parameters from the URL
 * 2. Session data from StripePaymentManager
 */
export function PaymentRedirectHandler() {
	const [, transactionProcess] = useTransactionProcessMutation();
	const [, checkoutComplete] = useCheckoutCompleteMutation();
	const { clearCortexData } = useCortexDataStore();
	const paymentManager = StripePaymentManager.getInstance();
	const hasProcessed = useRef(false);

	useEffect(() => {
		const handleRedirect = async () => {
			// Prevent duplicate processing
			if (hasProcessed.current) {
				console.warn("[REDIRECT] Already processed, skipping");
				return;
			}

			const { checkoutId, paymentIntent, paymentIntentClientSecret, processingPayment, transactionId } =
				getQueryParams();

			if (!checkoutId) {
				console.error("[REDIRECT] No checkout ID in URL");
				window.location.href = "/";
				return;
			}

			if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
				console.warn("[REDIRECT] Missing required query params", {
					paymentIntent,
					hasClientSecret: !!paymentIntentClientSecret,
					processingPayment,
				});
				return;
			}

			console.warn("[REDIRECT] Detected redirect from payment provider", {
				checkoutId,
				paymentIntent,
				hasClientSecret: !!paymentIntentClientSecret,
				processingPayment,
				transactionId,
			});

			hasProcessed.current = true;

			try {
				// Try to get session from payment manager first
				let session = paymentManager.getSession(checkoutId);
				let publishableKey = session?.publishableKey;
				let txId = session?.transactionId || transactionId;

				// If no session or missing data, we might need to handle this differently
				if (!publishableKey) {
					console.warn("[REDIRECT] No session found, this might be a webhook-created order");
					// In this case, the webhook might have already created the order
					// Just redirect to check for order
					window.location.href = `/checkout?checkout=${checkoutId}`;
					return;
				}

				if (!txId) {
					throw new Error("No transaction ID found. Please try again.");
				}

				console.warn("[REDIRECT] Loading Stripe with publishable key");

				// Load Stripe.js
				const stripe = await loadStripe(publishableKey);

				if (!stripe) {
					throw new Error("Failed to load Stripe. Please refresh and try again.");
				}

				console.warn("[REDIRECT] Retrieving payment intent status from Stripe");

				// Retrieve the payment intent from Stripe to get latest status
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

				console.warn("[REDIRECT] Processing transaction after redirect");

				// Process the transaction to update Saleor with payment status
				const processResult = await transactionProcess({
					id: txId,
					data: null,
				});

				if (processResult.error || processResult.data?.transactionProcess?.errors?.length) {
					console.error("[REDIRECT] Transaction process failed", processResult);
					throw new Error("Failed to process payment status");
				}

				console.warn("[REDIRECT] Calling checkoutComplete to create order");

				// Complete the checkout and create order
				const completeResult = await checkoutComplete({
					checkoutId,
				});

				if (completeResult.error || completeResult.data?.checkoutComplete?.errors?.length) {
					console.error("[REDIRECT] Checkout complete failed", completeResult);
					throw new Error("Failed to complete checkout");
				}

				const order = completeResult.data?.checkoutComplete?.order;

				if (order) {
					console.warn("[ORDER] Order created successfully", {
						orderId: order.id,
					});

					// Clear cortex data after successful checkout
					clearCortexData();

					// Clear session after successful completion
					paymentManager.clearSession(checkoutId);

					// Redirect to order confirmation
					const orderUrl = `/checkout?order=${order.id}`;
					console.warn("[ORDER] Redirecting to order confirmation", { url: orderUrl });
					window.location.href = orderUrl;
				} else {
					console.error("[ORDER] No order returned from checkoutComplete mutation");
					throw new Error("Order was not created");
				}
			} catch (error) {
				console.error("PaymentRedirectHandler: Failed to complete redirected payment", error);
				hasProcessed.current = false;
				// Show error in URL or redirect to checkout
				window.location.href = `/checkout?checkout=${checkoutId}`;
			}
		};

		void handleRedirect();
	}, [transactionProcess, checkoutComplete, clearCortexData, paymentManager]);

	return (
		<PaymentProcessingScreen>
			<CheckoutSkeleton />
		</PaymentProcessingScreen>
	);
}
