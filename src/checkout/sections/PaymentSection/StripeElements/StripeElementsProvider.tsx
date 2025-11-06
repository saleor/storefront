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

import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { apiErrorMessages } from "../errorMessages";
import { StripePaymentManager } from "./stripePaymentManager";
import { stripeGatewayId } from "./types";
import { usePaymentGatewaysInitializeMutation, useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface StripeElementsProviderProps {
	children: ReactNode;
}

interface TxInitData {
	paymentIntent?: {
		stripeClientSecret?: string;
		client_secret?: string;
	};
	publishableKey?: string;
}

export const StripeElementsProvider: FC<StripeElementsProviderProps> = ({ children }) => {
	const { checkout, fetching: checkoutFetching } = useCheckout();
	const { showCustomErrors } = useAlerts();
	const { errorMessages: _commonErrorMessages } = useErrorMessages(apiErrorMessages);

	const [, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();
	const [, transactionInitialize] = useTransactionInitializeMutation();

	const [isInitializing, setIsInitializing] = useState(false);
	const [initializationError, setInitializationError] = useState<string | null>(null);
	const [initializationStartTime, setInitializationStartTime] = useState<number | null>(null);
	const [initializationStep, setInitializationStep] = useState<string>("Preparing...");
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

		// Must have a valid total price (allow zero for gift cards and free orders)
		if (checkout.totalPrice?.gross?.amount === undefined || checkout.totalPrice.gross.amount === null) {
			return false;
		}

		// Negative amounts shouldn't exist but double-check
		if (checkout.totalPrice.gross.amount < 0) {
			return false;
		}

		return true;
	}, [checkout]);

	// Stable reference for initialization function
	const initializePaymentSession = useCallback(async () => {
		if (!checkout?.id || !isCheckoutReady) {
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

		// For zero-amount orders (fully covered by gift cards), skip Stripe initialization
		// Payment will be handled differently
		if (checkoutAmount === 0) {
			console.log("StripeElementsProvider: Zero-amount order, no payment required");
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
					setInitializationStep("Connecting to payment gateway...");

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
					publishableKey = (stripeCfgData?.stripePublishableKey as string | undefined) || null;

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
					setInitializationStep("Creating secure payment session...");

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

				setInitializationStep("Finalizing payment setup...");
				const finalSession = paymentManager.getSession(checkout.id);
				console.log("StripeElementsProvider: Initialization completed", finalSession);

				return finalSession;
			} catch (error) {
				console.error("StripeElementsProvider: Initialization failed", error);

				// Enhanced error handling based on error type
				if (error instanceof Error) {
					if (error.message.includes("publishable key")) {
						throw new Error("Payment gateway configuration error. Please contact support.");
					}
					if (error.message.includes("client secret")) {
						throw new Error("Payment session creation failed. Please try again.");
					}
					if (error.message.includes("Gateway initialization failed")) {
						throw new Error("Payment gateway is currently unavailable. Please try again later.");
					}
					if (error.message.includes("Transaction initialization failed")) {
						throw new Error("Payment setup failed. Please refresh the page and try again.");
					}
				}

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

	// Detect corrupted sessions and auto-recover
	useEffect(() => {
		if (checkout?.id && session) {
			const now = Date.now();
			const sessionAge = now - session.createdAt;

			// If session is older than 45 minutes or has invalid state, clear it
			if (
				sessionAge > 45 * 60 * 1000 ||
				(session.initialized && !session.clientSecret) ||
				(session.clientSecret && session.amount !== checkoutAmount)
			) {
				console.log("StripeElementsProvider: Clearing corrupted/expired session", {
					sessionAge: Math.floor(sessionAge / 1000),
					sessionAmount: session.amount,
					currentAmount: checkoutAmount,
					hasClientSecret: !!session.clientSecret,
					initialized: session.initialized,
				});

				paymentManager.clearSession(checkout.id);
				setSession(null);
				setIsInitializing(false);
				setInitializationError(null);
			}
		}
	}, [checkout?.id, session, checkoutAmount, paymentManager]);

	// Add recovery mechanism for stuck initialization state
	useEffect(() => {
		if (isInitializing && session?.initialized && session?.clientSecret) {
			console.log("StripeElementsProvider: Session is ready but still showing as initializing, fixing state");
			setIsInitializing(false);
			setInitializationError(null);
		}
	}, [isInitializing, session?.initialized, session?.clientSecret]);

	// Initialize payment session with debouncing
	useEffect(() => {
		let isCancelled = false;
		const currentCheckoutId = checkout?.id;
		const currentAmount = checkoutAmount;

		const initializeWithErrorHandling = async () => {
			if (isInitializing) {
				return; // Already initializing
			}

			setIsInitializing(true);
			setInitializationError(null);
			setInitializationStartTime(Date.now());
			setInitializationStep("Preparing...");

			try {
				const result = await initializePaymentSession();

				// Validate that checkout hasn't changed during initialization
				if (!isCancelled && result && currentCheckoutId === checkout?.id && currentAmount === checkoutAmount) {
					// Only update session if it's actually different to prevent unnecessary re-renders
					setSession((currentSession) => {
						if (
							!currentSession ||
							currentSession.clientSecret !== result.clientSecret ||
							currentSession.publishableKey !== result.publishableKey ||
							currentSession.initialized !== result.initialized
						) {
							console.log("StripeElementsProvider: Updating session with new data", {
								checkoutId: currentCheckoutId,
								amount: currentAmount,
							});
							return result;
						}
						return currentSession;
					});
				} else if (!isCancelled && (currentCheckoutId !== checkout?.id || currentAmount !== checkoutAmount)) {
					console.log("StripeElementsProvider: Discarding stale initialization result", {
						oldCheckoutId: currentCheckoutId,
						newCheckoutId: checkout?.id,
						oldAmount: currentAmount,
						newAmount: checkoutAmount,
					});
				}
			} catch (error) {
				console.error("StripeElementsProvider: Initialization error", error);

				if (!isCancelled && currentCheckoutId === checkout?.id) {
					const errorMessage = error instanceof Error ? error.message : "Payment initialization failed";
					setInitializationError(errorMessage);
					showCustomErrors([{ message: errorMessage }]);
				}
			} finally {
				if (!isCancelled && currentCheckoutId === checkout?.id) {
					setIsInitializing(false);
					setInitializationStartTime(null);
					setInitializationStep("Preparing...");
				}
			}
		};

		// Debounce initialization to prevent rapid-fire calls
		const timeoutId = setTimeout(initializeWithErrorHandling, 100);

		return () => {
			isCancelled = true;
			clearTimeout(timeoutId);
		};
	}, [initializePaymentSession, showCustomErrors, checkout?.id, checkoutAmount]);

	// Timeout for initialization
	useEffect(() => {
		if (!initializationStartTime || !isInitializing) {
			return;
		}

		const timeoutId = setTimeout(() => {
			const elapsed = Date.now() - initializationStartTime;
			if (elapsed > 30000) {
				// 30 seconds timeout
				console.error("StripeElementsProvider: Initialization timeout after 30 seconds");
				setIsInitializing(false);
				setInitializationStartTime(null);
				setInitializationStep("Preparing...");
				setInitializationError(
					"Payment initialization is taking too long. Please check your connection and try again.",
				);
			}
		}, 30000);

		return () => clearTimeout(timeoutId);
	}, [initializationStartTime, isInitializing]);

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
			console.log("StripeElementsProvider: No publishable key, skipping Stripe promise creation");
			return null;
		}
		console.log(
			"StripeElementsProvider: Creating Stripe promise with key",
			session.publishableKey.substring(0, 20) + "...",
		);
		return loadStripe(session.publishableKey);
	}, [session?.publishableKey]);

	// Memoize loading state condition to prevent unnecessary re-evaluations
	const shouldShowLoading = useMemo(() => {
		return (
			checkoutFetching ||
			isInitializing ||
			!session?.initialized ||
			!session?.clientSecret ||
			!stripePromise ||
			!isCheckoutReady
		);
	}, [
		checkoutFetching,
		isInitializing,
		session?.initialized,
		session?.clientSecret,
		stripePromise,
		isCheckoutReady,
	]);

	console.log("StripeElementsProvider: Render", {
		hasCheckout: !!checkout,
		checkoutId: checkout?.id,
		checkoutFetching,
		amount: checkout?.totalPrice?.gross?.amount,
		currency: checkout?.totalPrice?.gross?.currency,
		isInitializing,
		sessionInitialized: session?.initialized,
		hasClientSecret: !!session?.clientSecret,
		hasStripePromise: !!stripePromise,
		isCheckoutReady,
		shouldShowLoading,
	});

	// Show loading state during initialization or checkout fetching
	if (shouldShowLoading) {
		const getLoadingMessage = () => {
			if (checkoutFetching) return "Loading checkout...";
			if (!isCheckoutReady) {
				if (!checkout?.billingAddress) return "Please complete billing address to continue";
				if (checkout?.isShippingRequired && !checkout?.shippingAddress)
					return "Please complete shipping address to continue";
				if (checkout?.isShippingRequired && !checkout?.deliveryMethod)
					return "Please select a delivery method to continue";
				return "Finalizing checkout details...";
			}
			if (isInitializing) {
				const elapsed = initializationStartTime
					? Math.floor((Date.now() - initializationStartTime) / 1000)
					: 0;
				const baseMessage = initializationStep || "Setting up secure payment...";
				if (elapsed > 10) {
					return `${baseMessage} (${elapsed}s)`;
				}
				return baseMessage;
			}
			if (!session?.clientSecret) return "Preparing payment gateway...";
			return "Loading payment options...";
		};

		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center">
					<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
					<p className="text-white">{getLoadingMessage()}</p>
					{initializationError && (
						<div className="mt-4 rounded-md border border-red-700 bg-red-950 p-3">
							<p className="text-sm text-red-200">{initializationError}</p>
							<button
								className="mt-2 text-sm text-red-400 underline hover:text-red-300"
								onClick={() => {
									setInitializationError(null);
									setIsInitializing(false);
									setInitializationStartTime(null);
									setInitializationStep("Preparing...");
									// Clear session to force reinitialize
									if (checkout?.id) {
										paymentManager.clearSession(checkout.id);
									}
								}}
							>
								Try again
							</button>
							{process.env.NODE_ENV === "development" && (
								<details className="mt-2 text-xs text-gray-500">
									<summary>Debug Info</summary>
									<pre className="text-left text-xs">
										{JSON.stringify(
											{
												checkoutId: checkout?.id,
												amount: checkoutAmount,
												currency: checkoutCurrency,
												isCheckoutReady,
												hasSession: !!session,
												sessionInitialized: session?.initialized,
												hasClientSecret: !!session?.clientSecret,
												paymentManagerDebug: paymentManager.getDebugInfo(),
											},
											null,
											2,
										)}
									</pre>
								</details>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Provide Stripe context with client secret and appearance configuration
	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret: session?.clientSecret || undefined,
				appearance: {
					theme: "night",
					variables: {
						colorText: "#ffffff",
						colorTextSecondary: "#e5e5e5",
						colorTextPlaceholder: "#a3a3a3",
						colorBackground: "#262626",
						colorPrimary: "#ffffff",
						colorDanger: "#ef4444",
						fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
						fontSizeBase: "16px",
						borderRadius: "6px",
					},
				},
				// Enable automatic payment methods as per Stripe app documentation
				locale: "auto",
			}}
		>
			{children}
		</Elements>
	);
};
