import { OrderConfirmationHeaderSkeleton } from "./order-confirmation-header-skeleton";
import { OrderConfirmationBodySkeleton } from "./order-confirmation-body-skeleton";

/**
 * Page-level Suspense fallback for `/checkout/complete` — no `CheckoutIntlProvider` yet.
 * In-app loading uses `OrderConfirmationSkeleton` inside `OrderConfirmationApp` instead.
 */
export function OrderConfirmationRouteFallback() {
	return (
		<div className="min-h-screen overscroll-none bg-secondary">
			<OrderConfirmationHeaderSkeleton />
			<OrderConfirmationBodySkeleton />
		</div>
	);
}
