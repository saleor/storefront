import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useTransactionInitializeMutation, useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { apiErrorMessages } from "@/checkout/sections/PaymentSection/errorMessages";
import { replaceUrl } from "@/checkout/lib/utils/url";

interface PaymentIntentData {
	paymentIntent: {
		stripeClientSecret: string;
		errors?: Array<{ code: string; message: string }>;
	};
}

interface PaymentIntentParams {
	checkoutId: string;
	gatewayId: string;
}

interface ConfirmPaymentParams {
	stripe: Stripe;
	elements: StripeElements;
	billingDetails: {
		name: string;
		email: string;
		phone: string;
		address: {
			city: string;
			country: string;
			line1: string;
			line2: string;
			postal_code: string;
			state: string;
		};
	};
	returnUrl: string;
}

// Hook for initializing payment intent
export const usePaymentIntent = (params: PaymentIntentParams | null) => {
	const [, transactionInitialize] = useTransactionInitializeMutation();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	return useQuery({
		queryKey: ["paymentIntent", params?.checkoutId, params?.gatewayId],
		queryFn: async (): Promise<PaymentIntentData | null> => {
			if (!params) return null;

			console.log("React Query: Initializing payment intent", params);

			const result = await transactionInitialize({
				checkoutId: params.checkoutId,
				paymentGateway: {
					id: params.gatewayId,
					data: {
						paymentIntent: {
							paymentMethod: "card",
						},
					},
				},
			});

			if (result.error) {
				console.error("React Query: Payment intent initialization failed", result.error);
				throw new Error(commonErrorMessages.somethingWentWrong);
			}

			const data = result.data?.transactionInitialize?.data as PaymentIntentData | undefined;

			if (!data?.paymentIntent?.stripeClientSecret) {
				throw new Error("Failed to initialize payment intent");
			}

			if (data.paymentIntent.errors?.length) {
				throw new Error(data.paymentIntent.errors[0].message);
			}

			console.log("React Query: Payment intent initialized successfully");
			return data;
		},
		enabled: !!params?.checkoutId && !!params?.gatewayId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: 1,
	});
};

// Hook for confirming payment with Stripe
export const useConfirmPayment = () => {
	const queryClient = useQueryClient();
	const { showCustomErrors } = useAlerts();

	return useMutation({
		mutationKey: ["confirmPayment"],
		mutationFn: async ({ stripe, elements, billingDetails, returnUrl }: ConfirmPaymentParams) => {
			console.log("React Query: Confirming payment with Stripe");

			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl,
					payment_method_data: {
						billing_details: billingDetails,
					},
				},
				redirect: "if_required", // This is key - only redirect if required
			});

			if (result.error) {
				console.error("React Query: Payment confirmation error", result.error);
				throw result.error;
			}

			console.log("React Query: Payment confirmed successfully", result.paymentIntent?.status);
			return result;
		},
		onSuccess: () => {
			// Only invalidate checkout queries, not payment intent queries
			// Payment intent should not be refetched after successful confirmation
			void queryClient.invalidateQueries({ queryKey: ["checkout"] });
		},
		onError: (error: unknown) => {
			console.error("React Query: Payment confirmation failed", error);

			const stripeError = error as { type?: string; message?: string };
			if (stripeError.type === "card_error" || stripeError.type === "validation_error") {
				showCustomErrors([{ message: stripeError.message ?? "Something went wrong" }]);
			} else {
				showCustomErrors([{ message: "An unexpected error occurred." }]);
			}
		},
		retry: false, // Don't retry payment confirmations
	});
};

// Hook for completing checkout
export const useCompleteCheckout = () => {
	const { checkout } = useCheckout();
	const [, checkoutComplete] = useCheckoutCompleteMutation();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["completeCheckout"],
		mutationFn: async () => {
			console.log("React Query: Completing checkout", checkout.id);

			const result = await checkoutComplete({
				checkoutId: checkout.id,
			});

			if (result.error) {
				console.error("React Query: Checkout completion failed", result.error);
				throw result.error;
			}

			const order = result.data?.checkoutComplete?.order;
			if (!order) {
				throw new Error("No order returned from checkout completion");
			}

			console.log("React Query: Checkout completed successfully", order.id);
			return order;
		},
		onSuccess: (order) => {
			// Clear all checkout-related queries
			queryClient.removeQueries({ queryKey: ["paymentIntent"] });
			queryClient.removeQueries({ queryKey: ["checkout"] });

			// Redirect to order confirmation
			const newUrl = replaceUrl({
				query: {
					order: order.id,
				},
				replaceWholeQuery: true,
			});
			window.location.replace(newUrl);
		},
		onError: (error) => {
			console.error("React Query: Checkout completion failed", error);
		},
		retry: 1,
	});
};

// Hook for handling payment intent retrieval (for redirects)
export const useRetrievePaymentIntent = () => {
	return useMutation({
		mutationKey: ["retrievePaymentIntent"],
		mutationFn: async ({ stripe, clientSecret }: { stripe: Stripe; clientSecret: string }) => {
			console.log("React Query: Retrieving payment intent", clientSecret);

			const result = await stripe.retrievePaymentIntent(clientSecret);

			if (result.error) {
				console.error("React Query: Payment intent retrieval failed", result.error);
				throw result.error;
			}

			console.log("React Query: Payment intent retrieved", result.paymentIntent?.status);
			return result.paymentIntent;
		},
		retry: 1,
	});
};
