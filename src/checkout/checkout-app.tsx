"use client";

import { ErrorBoundary } from "react-error-boundary";

import type { CheckoutUser, ServerOrder, ShippingCountries } from "@/checkout/lib/checkout-types";
import { CheckoutDataProvider, type CheckoutLoadState } from "@/checkout/providers/checkout-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
import { CheckoutSessionProvider } from "@/checkout/providers/checkout-session";
import { RootViews } from "./views/root-views";
import { CheckoutCrashFallback } from "@/checkout/views/page-not-found";
import "./index.css";

type CheckoutAppProps = {
	checkoutId: string | null;
	orderId: string | null;
	loadState: CheckoutLoadState;
	initialOrder: ServerOrder | null;
	initialUser: CheckoutUser | null;
	shippingCountries: ShippingCountries;
};

/**
 * Client shell for checkout UI. Session and cart data flow through RSC + server actions.
 */
export function CheckoutApp({
	checkoutId,
	orderId,
	loadState,
	initialOrder,
	initialUser,
	shippingCountries,
}: CheckoutAppProps) {
	return (
		<CheckoutSessionProvider checkoutId={checkoutId} orderId={orderId}>
			<CheckoutUserProvider initialUser={initialUser}>
				<CheckoutDataProvider
					checkoutId={checkoutId}
					loadState={loadState}
					initialOrder={initialOrder}
					shippingCountries={shippingCountries}
				>
					<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
						<RootViews />
					</ErrorBoundary>
				</CheckoutDataProvider>
			</CheckoutUserProvider>
		</CheckoutSessionProvider>
	);
}
