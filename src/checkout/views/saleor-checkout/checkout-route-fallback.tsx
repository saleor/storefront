import { CheckoutSkeleton } from "./checkout-skeleton";

/**
 * Page-level Suspense fallback for `/checkout` — no `NextIntlClientProvider` yet.
 * In-app loading (payment step, URL step) uses `CheckoutLoadingFallback` instead.
 */
export function CheckoutRouteFallback() {
	return <CheckoutSkeleton step={1} isShippingRequired={true} />;
}
