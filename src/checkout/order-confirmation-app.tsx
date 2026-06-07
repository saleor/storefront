"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { CheckoutUser, ServerOrder } from "@/checkout/lib/checkout-types";
import { CheckoutDataProvider } from "@/checkout/providers/checkout-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
import { CheckoutSessionProvider } from "@/checkout/providers/checkout-session";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/order-confirmation";
import { CheckoutCrashFallback } from "@/checkout/views/page-not-found";
import "./index.css";

type OrderConfirmationAppProps = {
	orderId: string | null;
	initialOrder: ServerOrder | null;
	initialUser: CheckoutUser | null;
};

/**
 * Client shell for order confirmation — separate from active checkout (`CheckoutApp`).
 */
export function OrderConfirmationApp({ orderId, initialOrder, initialUser }: OrderConfirmationAppProps) {
	const loadState = initialOrder ? "order" : "not_found";

	return (
		<CheckoutSessionProvider checkoutId={null} orderId={orderId}>
			<CheckoutUserProvider initialUser={initialUser}>
				<CheckoutDataProvider
					key={orderId ?? "none"}
					checkoutId={null}
					loadState={loadState}
					initialCheckout={null}
					initialOrder={initialOrder}
					shippingCountries={[]}
				>
					<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
						<Suspense fallback={<OrderConfirmationSkeleton />}>
							<OrderConfirmation />
						</Suspense>
					</ErrorBoundary>
				</CheckoutDataProvider>
			</CheckoutUserProvider>
		</CheckoutSessionProvider>
	);
}
