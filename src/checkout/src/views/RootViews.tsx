import { Suspense } from "react";
import { Checkout, CheckoutSkeleton } from "@/checkout/src/views/Checkout";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/src/views/OrderConfirmation";
import { getQueryParams } from "@/checkout/src/lib/utils/url";
import { PaymentProcessingScreen } from "@/checkout/src/sections/PaymentSection/PaymentProcessingScreen";

export const RootViews = () => {
	const orderId = getQueryParams().orderId;

	if (orderId) {
		return (
			<Suspense fallback={<OrderConfirmationSkeleton />}>
				<OrderConfirmation />
			</Suspense>
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
