import { Suspense } from "react";
import { Checkout, CheckoutSkeleton } from "@/checkout/views/Checkout";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/OrderConfirmation";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { PaymentProcessingScreen } from "@/checkout/sections/PaymentSection/PaymentProcessingScreen";
import { PaymentRedirectHandler } from "@/checkout/sections/PaymentSection/PaymentRedirectHandler";

export const RootViews = () => {
	const { orderId, processingPayment, paymentIntent, paymentIntentClientSecret } = getQueryParams();

	// Show order confirmation when we have an order ID
	// Don't show checkout form during payment processing or when order is confirmed
	if (orderId) {
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

	// Don't render checkout form if we're processing payment to avoid "Fill your information" flash
	if (processingPayment) {
		return (
			<PaymentProcessingScreen>
				<CheckoutSkeleton />
			</PaymentProcessingScreen>
		);
	}

	return (
		<PaymentProcessingScreen>
			<Suspense fallback={<CheckoutSkeleton />}>
				<Checkout />
			</Suspense>
		</PaymentProcessingScreen>
	);
};
