"use client";

import { useEffect, useRef, useState } from "react";
import { getQueryParams, replaceUrl } from "@/checkout/lib/utils/url";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/views/Checkout";
import { PaymentProcessingScreen } from "./PaymentProcessingScreen";

/**
 * Handles recovery from stuck payment state
 *
 * This happens when:
 * 1. processingPayment=true is in URL
 * 2. But payment_intent and payment_intent_client_secret are missing
 *
 * This can occur when:
 * - Stripe redirects without adding payment_intent params
 * - Payment succeeds without redirect but return URL has processingPayment=true
 * - Race condition where page loads before Stripe adds params
 *
 * Strategy:
 * 1. Wait briefly for URL params to update (in case of race condition)
 * 2. Check checkout payment status
 * 3. If fully paid, complete checkout and redirect to order
 * 4. Otherwise, clear processingPayment flag and return to checkout form
 */
export function StuckPaymentRecovery() {
	const { checkout, loading, refetch } = useCheckout();
	const [, checkoutComplete] = useCheckoutCompleteMutation();
	const hasProcessed = useRef(false);
	const [recoveryMessage, setRecoveryMessage] = useState("Processing payment...");

	useEffect(() => {
		const handleRecovery = async () => {
			if (hasProcessed.current) {
				return;
			}

			const { checkoutId, processingPayment } = getQueryParams();

			if (!processingPayment || !checkoutId) {
				console.warn("[RECOVERY] No processingPayment flag or checkoutId, redirecting to checkout");
				window.location.href = `/checkout${checkoutId ? `?checkout=${checkoutId}` : ""}`;
				return;
			}

			console.warn("[RECOVERY] Starting stuck payment recovery", {
				checkoutId,
				processingPayment,
			});

			hasProcessed.current = true;

			try {
				// Wait 2 seconds for potential race condition where URL params are being added
				console.warn("[RECOVERY] Waiting 2 seconds for URL params to potentially update...");
				setRecoveryMessage("Checking payment status...");
				await new Promise((resolve) => setTimeout(resolve, 2000));

				// Check if params appeared after waiting
				const updatedParams = getQueryParams();
				if (updatedParams.paymentIntent && updatedParams.paymentIntentClientSecret) {
					console.warn("[RECOVERY] Payment intent params appeared after waiting, reloading page");
					window.location.reload();
					return;
				}

				console.warn("[RECOVERY] Still no payment intent params, checking checkout status");
				setRecoveryMessage("Verifying payment...");

				// Refetch checkout to get latest status
				const result = await refetch();
				const latestCheckout = result.data?.checkout;

				if (!latestCheckout) {
					console.error("[RECOVERY] Checkout not found after refetch");
					throw new Error("Checkout not found. The order may have already been created.");
				}

				console.warn("[RECOVERY] Checkout status", {
					authorizeStatus: latestCheckout.authorizeStatus,
					chargeStatus: latestCheckout.chargeStatus,
				});

				// Check if payment is fully authorized and charged
				if (
					latestCheckout.authorizeStatus === "FULL" &&
					latestCheckout.chargeStatus === "FULL"
				) {
					console.warn("[RECOVERY] Payment is fully processed, completing checkout");
					setRecoveryMessage("Payment confirmed! Creating your order...");

					// Complete the checkout
					const completeResult = await checkoutComplete({
						checkoutId,
					});

					if (completeResult.error || completeResult.data?.checkoutComplete?.errors?.length) {
						console.error("[RECOVERY] Checkout complete failed", completeResult);
						throw new Error("Failed to complete checkout");
					}

					const order = completeResult.data?.checkoutComplete?.order;

					if (order) {
						console.warn("[RECOVERY] Order created successfully", {
							orderId: order.id,
						});

						// Redirect to order confirmation
						window.location.href = `/checkout?order=${order.id}`;
						return;
					} else {
						throw new Error("Order was not created");
					}
				} else {
					// Payment not fully processed yet - could be webhook delay or payment actually failed
					console.warn("[RECOVERY] Payment not fully processed, clearing processingPayment flag", {
						authorizeStatus: latestCheckout.authorizeStatus,
						chargeStatus: latestCheckout.chargeStatus,
					});

					setRecoveryMessage("Payment status unclear. Returning to checkout...");

					// Wait a moment before redirecting
					await new Promise((resolve) => setTimeout(resolve, 1500));

					// Clear the processingPayment flag and return to checkout
					replaceUrl({
						query: {
							processingPayment: undefined,
						},
					});

					// Force reload to show checkout form
					window.location.reload();
				}
			} catch (error) {
				console.error("[RECOVERY] Failed to recover from stuck payment state", error);
				hasProcessed.current = false;

				setRecoveryMessage(
					error instanceof Error
						? error.message
						: "Unable to verify payment. Please check your order history."
				);

				// Wait a moment to show error message
				await new Promise((resolve) => setTimeout(resolve, 3000));

				// Clear processingPayment flag and return to checkout
				const { checkoutId } = getQueryParams();
				window.location.href = `/checkout${checkoutId ? `?checkout=${checkoutId}` : ""}`;
			}
		};

		void handleRecovery();
	}, [checkout, refetch, checkoutComplete, loading]);

	return (
		<PaymentProcessingScreen>
			<div className="flex flex-col items-center justify-center gap-4 py-8">
				<CheckoutSkeleton />
				<p className="text-sm text-neutral-400">{recoveryMessage}</p>
			</div>
		</PaymentProcessingScreen>
	);
}
