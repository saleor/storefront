import type { ServerCheckout } from "@/checkout/lib/checkout-types";

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
 * Merge a live Saleor snapshot into client state on checkout entry.
 *
 * Use for the mount-time `syncCheckoutFromServer` call — not for explicit `refreshCheckout`,
 * which always replaces client state (promos, cart edits, order summary).
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
