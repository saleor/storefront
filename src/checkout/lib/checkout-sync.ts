import type { CheckoutLoadState, ServerCheckout } from "@/checkout/lib/checkout-types";

/** Stable fingerprint of cart line items for comparing checkout snapshots. */
export function checkoutLinesSignature(checkout: ServerCheckout | null | undefined): string {
	if (!checkout?.lines.length) {
		return "";
	}

	return checkout.lines
		.map((line) => `${line.id}:${line.quantity}`)
		.sort()
		.join("|");
}

/** True when server and client snapshots represent the same cart contents. */
export function checkoutsHaveSameLines(
	a: ServerCheckout | null | undefined,
	b: ServerCheckout | null | undefined,
): boolean {
	return checkoutLinesSignature(a) === checkoutLinesSignature(b);
}

/**
 * Merge an incoming RSC snapshot into client checkout state.
 *
 * Used when `initialCheckout` updates after `router.refresh()` — not for explicit
 * `refreshCheckout()`, which always replaces client state (promos, cart edits, totals).
 *
 * Adopts the server when checkout id or line items changed; otherwise keeps client state
 * so in-flow edits (address, shipping method) are not overwritten by a redundant fetch.
 */
export function adoptCheckoutSnapshot(current: ServerCheckout | null, fresh: ServerCheckout): ServerCheckout {
	if (!current) {
		return fresh;
	}
	if (current.id !== fresh.id) {
		return fresh;
	}
	if (!checkoutsHaveSameLines(current, fresh)) {
		return fresh;
	}
	return current;
}

/**
 * Only expose checkout data when it belongs to the active session id.
 * Prevents flashing a previous cart after order completion or checkout id change.
 */
export function resolveSessionCheckout(
	checkout: ServerCheckout | null,
	checkoutId: string | null,
	loadState: CheckoutLoadState,
): ServerCheckout | null {
	if (loadState !== "ready" || !checkoutId || !checkout) {
		return null;
	}

	return checkout.id === checkoutId ? checkout : null;
}
