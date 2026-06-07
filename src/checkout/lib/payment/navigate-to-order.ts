import { buildOrderConfirmationPath } from "@paper/session-bridge";

/**
 * Client navigation to `/checkout/complete?order=`.
 *
 * Intentionally **not** `redirect()` inside `runCheckoutComplete` — server redirects throw
 * `NEXT_REDIRECT`, which Stripe payment try/catch blocks surface as a false "Payment failed"
 * banner while the order may already exist. Client `window.location.replace` loads the
 * confirmation RSC tree reliably without going through those catch blocks.
 *
 * Cookie clear is deferred via `after()` in the server action so this navigation can run first;
 * `RootViews` keeps `PaymentCompletingScreen` up until we leave `/checkout?checkout=…`.
 */
export function navigateToOrderConfirmation(orderId: string) {
	const path = buildOrderConfirmationPath({ orderId });
	window.location.replace(path);
}
