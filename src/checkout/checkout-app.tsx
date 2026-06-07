"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type {
	CheckoutUser,
	ServerCheckout,
	ServerOrder,
	ShippingCountries,
} from "@/checkout/lib/checkout-types";
import { CheckoutDataProvider, type CheckoutLoadState } from "@/checkout/providers/checkout-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
import { CheckoutSessionProvider } from "@/checkout/providers/checkout-session";
import { RootViews } from "./views/root-views";
import { CheckoutSessionCleanup } from "@/checkout/components/checkout-session-cleanup";
import { StripeCheckoutCompletionHost } from "@/checkout/components/payment/stripe/stripe-checkout-completion-host";
import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { CheckoutCrashFallback } from "@/checkout/views/page-not-found";
import "./index.css";

type CheckoutAppProps = {
	checkoutId: string | null;
	orderId: string | null;
	loadState: CheckoutLoadState;
	initialCheckout: ServerCheckout | null;
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
	initialCheckout,
	initialOrder,
	initialUser,
	shippingCountries,
}: CheckoutAppProps) {
	return (
		<CheckoutSessionProvider checkoutId={checkoutId} orderId={orderId}>
			<CheckoutSessionCleanup />
			<CheckoutUserProvider initialUser={initialUser}>
				<CheckoutDataProvider
					key={checkoutId ?? orderId ?? "none"}
					checkoutId={checkoutId}
					loadState={loadState}
					initialCheckout={initialCheckout}
					initialOrder={initialOrder}
					shippingCountries={shippingCountries}
				>
					<Suspense fallback={null}>
						<StripeCheckoutCompletionHost />
					</Suspense>
					<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
						<Suspense fallback={<CheckoutLoadingFallback />}>
							<RootViews />
						</Suspense>
					</ErrorBoundary>
				</CheckoutDataProvider>
			</CheckoutUserProvider>
		</CheckoutSessionProvider>
	);
}
