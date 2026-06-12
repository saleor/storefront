"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { CheckoutUser, ServerOrder } from "@/checkout/lib/checkout-types";
import { OrderDataProvider } from "@/checkout/providers/order-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
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
	return (
		<CheckoutUserProvider initialUser={initialUser}>
			<OrderDataProvider orderId={orderId} initialOrder={initialOrder}>
				<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
					<Suspense fallback={<OrderConfirmationSkeleton />}>
						<OrderConfirmation />
					</Suspense>
				</ErrorBoundary>
			</OrderDataProvider>
		</CheckoutUserProvider>
	);
}
