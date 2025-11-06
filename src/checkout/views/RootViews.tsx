import { Suspense } from "react";
import { Checkout, CheckoutSkeleton } from "@/checkout/views/Checkout";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/OrderConfirmation";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { PaymentProcessingScreen } from "@/checkout/sections/PaymentSection/PaymentProcessingScreen";
import { PaymentRedirectHandler } from "@/checkout/sections/PaymentSection/PaymentRedirectHandler";
import { StuckPaymentRecovery } from "@/checkout/sections/PaymentSection/StuckPaymentRecovery";

export const RootViews = () => {
	const { orderId, processingPayment, paymentIntent, paymentIntentClientSecret, transactionId, checkoutId } = getQueryParams();

	// Log on every render to diagnose flow
	console.warn("[ROOT_VIEWS] Rendering with params", {
		orderId,
		processingPayment,
		paymentIntent,
		paymentIntentClientSecret: paymentIntentClientSecret ? "present" : "missing",
		transactionId,
		checkoutId,
	});

	// Show order confirmation when we have an order ID
	// Don't show checkout form during payment processing or when order is confirmed
	if (orderId) {
		console.warn("[ROOT_VIEWS] Rendering OrderConfirmation");

		return (
			<Suspense fallback={<OrderConfirmationSkeleton />}>
				<OrderConfirmation />
			</Suspense>
		);
	}

	// Handle payment redirect (user returning from PayPal, etc.)
	// This needs to happen BEFORE trying to load checkout, as the checkout might already be an order
	if (processingPayment && paymentIntent && paymentIntentClientSecret) {
		return <PaymentRedirectHandler />;
	}

	// Handle stuck payment state (processingPayment=true but no payment_intent params)
	// This can happen if Stripe redirects without adding params, or if payment succeeds without redirect
	if (processingPayment && (!paymentIntent || !paymentIntentClientSecret)) {
		console.warn("[ROOT] Detected stuck payment state - processingPayment=true but missing payment_intent params");
		return <StuckPaymentRecovery />;
	}

	return (
		<PaymentProcessingScreen>
			<Suspense fallback={<CheckoutSkeleton />}>
				<Checkout />
			</Suspense>
		</PaymentProcessingScreen>
	);
};
