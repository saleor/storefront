"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { nextCheckoutTransport } from "@/app/(checkout)/checkout-transport";
import type { CheckoutUser, ServerCheckout, ShippingCountries } from "@/checkout/lib/checkout-types";
import { setCheckoutTransport } from "@/checkout/lib/checkout-transport";
import { CheckoutContentProvider, type CheckoutContent } from "@/lib/content";
import { CheckoutDataProvider, type CheckoutLoadState } from "@/checkout/providers/checkout-data";
import { CheckoutUserProvider } from "@/checkout/providers/checkout-user";
import { CheckoutBrowseProvider } from "@/checkout/providers/checkout-browse";
import { CheckoutSessionProvider } from "@/checkout/providers/checkout-session";
import { CheckoutPaymentReturnErrorProvider } from "@/checkout/providers/checkout-payment-return-error";
import type { LocaleSlug } from "@/config/locale";
import { RootViews } from "./views/root-views";
import { CheckoutPaymentHistoryGuard } from "@/checkout/components/checkout-payment-history-guard";
import { CheckoutSessionCleanup } from "@/checkout/components/checkout-session-cleanup";
import { StripeCheckoutCompletionHost } from "@/checkout/components/payment/stripe/stripe-checkout-completion-host";
import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { CheckoutCrashFallback } from "@/checkout/views/page-not-found";
import "./index.css";

// Composition root: payment modules and CheckoutDataProvider reach Saleor only
// through the CheckoutTransport seam; the checkout shell wires in the Next.js
// server-action implementation before any of them can run.
setCheckoutTransport(nextCheckoutTransport);

type CheckoutAppProps = {
	checkoutId: string | null;
	loadState: CheckoutLoadState;
	initialCheckout: ServerCheckout | null;
	initialUser: CheckoutUser | null;
	shippingCountries: ShippingCountries;
	checkoutContent: CheckoutContent;
	storefrontLocale: LocaleSlug;
};

/**
 * Client shell for active checkout UI. Session and cart data flow through RSC + server actions.
 * Order confirmation uses `OrderConfirmationApp` on `/checkout/complete`.
 */
export function CheckoutApp({
	checkoutId,
	loadState,
	initialCheckout,
	initialUser,
	shippingCountries,
	checkoutContent,
	storefrontLocale,
}: CheckoutAppProps) {
	return (
		<CheckoutBrowseProvider locale={storefrontLocale}>
			<CheckoutSessionProvider checkoutId={checkoutId} orderId={null}>
				<CheckoutSessionCleanup />
				<CheckoutPaymentHistoryGuard />
				<CheckoutUserProvider initialUser={initialUser}>
					<CheckoutDataProvider
						key={checkoutId ?? "none"}
						checkoutId={checkoutId}
						loadState={loadState}
						initialCheckout={initialCheckout}
						shippingCountries={shippingCountries}
					>
						<CheckoutContentProvider content={checkoutContent}>
							<CheckoutPaymentReturnErrorProvider>
								<Suspense fallback={null}>
									<StripeCheckoutCompletionHost />
								</Suspense>
								<ErrorBoundary FallbackComponent={CheckoutCrashFallback}>
									<Suspense fallback={<CheckoutLoadingFallback />}>
										<RootViews />
									</Suspense>
								</ErrorBoundary>
							</CheckoutPaymentReturnErrorProvider>
						</CheckoutContentProvider>
					</CheckoutDataProvider>
				</CheckoutUserProvider>
			</CheckoutSessionProvider>
		</CheckoutBrowseProvider>
	);
}
