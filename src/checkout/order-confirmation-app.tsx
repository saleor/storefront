"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { CheckoutUser, ServerOrder } from "@/checkout/lib/checkout-types";
import { CheckoutBrowseProvider } from "@/checkout/providers/checkout-browse";
import { OrderDataProvider } from "@/checkout/providers/order-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/order-confirmation";
import { CheckoutCrashFallback } from "@/checkout/views/page-not-found";
import "./index.css";

import type { LocaleSlug } from "@/config/locale";

type OrderConfirmationAppProps = {
	orderId: string | null;
	initialOrder: ServerOrder | null;
	initialUser: CheckoutUser | null;
	storefrontLocale: LocaleSlug;
};

/**
 * Client shell for order confirmation — separate from active checkout (`CheckoutApp`).
 */
export function OrderConfirmationApp({
	orderId,
	initialOrder,
	initialUser,
	storefrontLocale,
}: OrderConfirmationAppProps) {
	return (
		<CheckoutBrowseProvider locale={storefrontLocale}>
			<CheckoutUserProvider initialUser={initialUser}>
				<OrderDataProvider orderId={orderId} initialOrder={initialOrder}>
					<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
						<Suspense fallback={<OrderConfirmationSkeleton />}>
							<OrderConfirmation />
						</Suspense>
					</ErrorBoundary>
				</OrderDataProvider>
			</CheckoutUserProvider>
		</CheckoutBrowseProvider>
	);
}
