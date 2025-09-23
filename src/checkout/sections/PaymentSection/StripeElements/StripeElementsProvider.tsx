/**
 * Improved Stripe Elements Provider
 *
 * Implements proper payment intent lifecycle management with:
 * - Idempotency protection
 * - Race condition prevention
 * - Optimized React effects
 * - Transaction process session handling
 */

"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessages } from "../errorMessages";
import { StripePaymentManager } from "./stripePaymentManager";
import { stripeGatewayId } from "./types";
import { usePaymentGatewaysInitializeMutation, useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface StripeElementsProviderProps {
	children: React.ReactNode;
}

interface TxInitData {
	paymentIntent?: {
		stripeClientSecret?: string;
		client_secret?: string;
	};
	publishableKey?: string;
}

export const StripeElementsProvider: React.FC<StripeElementsProviderProps> = ({ children }) => {
	const { checkout, fetching: checkoutFetching } = useCheckout();
	const { showCustomErrors } = useAlerts();
	const { errorMessages: _commonErrorMessages } = useErrorMessages(apiErrorMessages);

	console.log("StripeElementsProvider: Render", {
		hasCheckout: !!checkout,
		checkoutId: checkout?.id,
		checkoutFetching,
		amount: checkout?.totalPrice?.gross?.amount,
		currency: checkout?.totalPrice?.gross?.currency,
	});

	const [, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();
	const [, transactionInitialize] = useTransactionInitializeMutation();

	const [isInitializing, setIsInitializing] = useState(false);
	const [initializationError, setInitializationError] = useState<string | null>(null);
	const [session, setSession] = useState(() =>
		checkout?.id ? StripePaymentManager.getInstance().getSession(checkout.id) : null,
	);

	const paymentManager = useMemo(() => StripePaymentManager.getInstance(), []);

	// Memoize amount calculation to prevent unnecessary re-renders
	const checkoutAmount = useMemo(() => {
		return checkout?.totalPrice?.gross?.amount || 0;
	}, [checkout?.totalPrice?.gross?.amount]);

	const checkoutCurrency = useMemo(() => {
		return checkout?.totalPrice?.gross?.currency || "USD";
	}, [checkout?.totalPrice?.gross?.currency]);

	// Check if checkout is ready for payment processing
	const isCheckoutReady = useMemo(() => {
		if (!checkout) return false;

		// Must have billing address
		if (!checkout.billingAddress) {
			return false;
		}

		// If shipping is required, must have shipping address and delivery method
		if (checkout.isShippingRequired) {
			if (!checkout.shippingAddress || !checkout.deliveryMethod) {
				return false;
			}
		}

		// Must have a stable total (not zero)
		if (!checkout.totalPrice?.gross?.amount || checkout.totalPrice.gross.amount <= 0) {
			return false;
		}

		return true;
	}, [checkout]);

	// Stable reference for initialization function
	const initializePaymentSession = useCallback(async () => {
		if (!checkout?.id || checkoutAmount <= 0 || !isCheckoutReady) {
			console.log("StripeElementsProvider: Skipping initialization - checkout not ready", {
				checkoutId: checkout?.id,
				amount: checkoutAmount,
				hasCheckout: !!checkout,
				isCheckoutReady,
				hasBillingAddress: !!checkout?.billingAddress,
				hasShippingAddress: !!checkout?.shippingAddress,
				hasDeliveryMethod: !!checkout?.deliveryMethod,
				isShippingRequired: !!checkout?.isShippingRequired,
			});
			return null;
		}

		// Check if we need to reinitialize
		if (!paymentManager.shouldReinitialize(checkout.id, checkoutAmount)) {
			const existingSession = paymentManager.getSession(checkout.id);
			console.log("StripeElementsProvider: Using existing session", existingSession);
			return existingSession;
		}

		console.log("StripeElementsProvider: Starting initialization", {
			checkoutId: checkout.id,
			amount: checkoutAmount,
			currency: checkoutCurrency,
		});

		return paymentManager.acquireInitializationLock(checkout.id, async () => {
			try {
				// Get or create session
				const paymentSession = paymentManager.getOrCreateSession(
					checkout.id,
					checkoutAmount,
					checkoutCurrency,
				);

				// Step 1: Initialize payment gateway to get publishable key (if not already available)
				let publishableKey = paymentSession.publishableKey;
				if (!publishableKey) {
					console.log("StripeElementsProvider: Fetching publishable key");

					const gatewayResult = await paymentGatewaysInitialize({
						checkoutId: checkout.id,
						paymentGateways: [{ id: stripeGatewayId }],
					});

					if (gatewayResult.error || gatewayResult.data?.paymentGatewayInitialize?.errors?.length) {
						throw new Error(
							`Gateway initialization failed: ${
								gatewayResult.data?.paymentGatewayInitialize?.errors?.[0]?.message ||
								gatewayResult.error?.message ||
								"Unknown error"
							}`,
						);
					}

					const stripeCfg = gatewayResult.data?.paymentGatewayInitialize?.gatewayConfigs?.find(
						(g) => g?.id === stripeGatewayId,
					);

					const stripeCfgData = stripeCfg?.data as Record<string, unknown> | undefined;
					publishableKey = stripeCfgData?.stripePublishableKey as string | undefined;

					if (!publishableKey) {
						throw new Error("No publishable key received from payment gateway");
					}

					paymentManager.updateSession(checkout.id, { publishableKey });
				}

				// Step 2: Initialize transaction to get client secret (if not already available)
				let clientSecret = paymentSession.clientSecret;
				let transactionId = paymentSession.transactionId;

				if (!clientSecret || !paymentSession.initialized) {
					console.log("StripeElementsProvider: Creating payment intent via transaction initialize");

					const txResult = await transactionInitialize({
						checkoutId: checkout.id,
						amount: checkoutAmount,
						paymentGateway: {
							id: stripeGatewayId,
							data: {
								paymentIntent: {
									paymentMethod: "card", // Using dynamic payment methods as per documentation
								},
							},
						},
						// Let Saleor generate idempotency key for us, or we could pass our own
						// idempotencyKey: paymentSession.idempotencyKey,
					});

					if (txResult.error || txResult.data?.transactionInitialize?.errors?.length) {
						throw new Error(
							`Transaction initialization failed: ${
								txResult.data?.transactionInitialize?.errors?.[0]?.message ||
								txResult.error?.message ||
								"Unknown error"
							}`,
						);
					}

					const txData = txResult.data?.transactionInitialize?.data as TxInitData | undefined;
					clientSecret =
						txData?.paymentIntent?.stripeClientSecret ?? txData?.paymentIntent?.client_secret ?? null;
					transactionId = txResult.data?.transactionInitialize?.transaction?.id ?? null;

					if (!clientSecret) {
						throw new Error("No client secret received from transaction initialization");
					}

					// Extract payment intent ID from client secret
					const paymentIntentId = clientSecret.split("_secret_")[0];

					paymentManager.updateSession(checkout.id, {
						clientSecret,
						transactionId,
						paymentIntentId,
						initialized: true,
					});
				}

				const finalSession = paymentManager.getSession(checkout.id);
				console.log("StripeElementsProvider: Initialization completed", finalSession);

				return finalSession;
			} catch (error) {
				console.error("StripeElementsProvider: Initialization failed", error);
				throw error;
			}
		});
	}, [
		checkout,
		checkoutAmount,
		checkoutCurrency,
		isCheckoutReady,
		paymentGatewaysInitialize,
		transactionInitialize,
		paymentManager,
	]);

	// Initialize payment session with debouncing
	useEffect(() => {
		let isCancelled = false;

		const initializeWithErrorHandling = async () => {
			if (isInitializing) {
				return; // Already initializing
			}

			setIsInitializing(true);
			setInitializationError(null);

			try {
				const result = await initializePaymentSession();

				if (!isCancelled && result) {
					setSession(result);
				}
			} catch (error) {
				console.error("StripeElementsProvider: Initialization error", error);

				if (!isCancelled) {
					const errorMessage = error instanceof Error ? error.message : "Payment initialization failed";
					setInitializationError(errorMessage);
					showCustomErrors([{ message: errorMessage }]);
				}
			} finally {
				if (!isCancelled) {
					setIsInitializing(false);
				}
			}
		};

		// Debounce initialization to prevent rapid-fire calls
		const timeoutId = setTimeout(initializeWithErrorHandling, 100);

		return () => {
			isCancelled = true;
			clearTimeout(timeoutId);
		};
	}, [initializePaymentSession, showCustomErrors, isInitializing]);

	// Cleanup on unmount or checkout change
	useEffect(() => {
		return () => {
			// Don't clear session on every effect run, only on actual cleanup
			const currentCheckoutId = checkout?.id;
			if (currentCheckoutId) {
				setTimeout(() => {
					// Only clear if we're still dealing with the same checkout
					if (currentCheckoutId === checkout?.id) {
						// Don't clear automatically - let session expire naturally
						// paymentManager.clearSession(checkout.id);
					}
				}, 0);
			}
		};
	}, [checkout?.id]); // Run on mount/unmount and checkout changes

	// Create Stripe promise only when we have a publishable key
	const stripePromise = useMemo(() => {
		if (!session?.publishableKey) {
			return null;
		}
		return loadStripe(session.publishableKey);
	}, [session?.publishableKey]);

	// Show loading state during initialization or checkout fetching
	if (
		checkoutFetching ||
		isInitializing ||
		!session?.initialized ||
		!session?.clientSecret ||
		!stripePromise ||
		!isCheckoutReady
	) {
		const getLoadingMessage = () => {
			if (checkoutFetching) return "Loading checkout...";
			if (!isCheckoutReady) {
				if (!checkout?.billingAddress) return "Waiting for billing address...";
				if (checkout?.isShippingRequired && !checkout?.shippingAddress)
					return "Waiting for shipping address...";
				if (checkout?.isShippingRequired && !checkout?.deliveryMethod)
					return "Waiting for delivery method...";
				return "Finalizing checkout details...";
			}
			return "Initializing payment...";
		};

		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center">
					<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
					<p className="text-gray-600">{getLoadingMessage()}</p>
					{initializationError && <p className="mt-2 text-sm text-red-600">{initializationError}</p>}
				</div>
			</div>
		);
	}

	// Provide Stripe context with client secret and appearance configuration
	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret: session.clientSecret,
				appearance: {
					theme: "stripe",
				},
				// Enable automatic payment methods as per Stripe app documentation
				locale: "auto",
			}}
		>
			{children}
		</Elements>
	);
};
