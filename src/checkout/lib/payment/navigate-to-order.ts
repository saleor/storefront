import { buildOrderConfirmationPath } from "@paper/session-bridge";
import { bumpChromeVersion } from "@/lib/chrome-sync";

/**
 * Client navigation to `/order/{hmac}`.
 *
 * Intentionally **not** `redirect()` inside `runCheckoutComplete` — server redirects throw
 * `NEXT_REDIRECT`, which Stripe payment try/catch blocks surface as a false "Payment failed"
 * banner while the order may already exist.
 *
 * Uses `window.location.replace` (not `router.replace`) — soft App Router navigation from
 * async post-mutation callbacks does not reliably unmount checkout, which leaves
 * `PaymentCompletingScreen` stuck even after the order is created.
 *
 * Cookie clear is deferred via `after()` in the server action so this navigation can run first;
 * `RootViews` keeps `PaymentCompletingScreen` up until the document unloads.
 */
export function navigateToOrderConfirmation(orderViewToken: string) {
	// Order placed → cart cookie is being cleared; storefront tabs re-render
	// their cart chrome on next focus.
	bumpChromeVersion();
	const browseLocale = new URLSearchParams(window.location.search).get("locale");
	const path = buildOrderConfirmationPath({ token: orderViewToken, browseLocale });
	window.location.replace(path);
}
