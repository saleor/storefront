import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import { getAddressInputDataFromAddress } from "@/checkout/components/address-form/utils";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import {
	availabilityIssueFromFieldErrors,
	stockLinesFromProblems,
	unavailableGiftLineIds,
	type CheckoutAvailabilityIssue,
} from "@/checkout/lib/checkout-availability";

/**
 * Why the shopper cannot go on. `checkout`: the fresh checkout Saleor answered with, whose live
 * `problems` list the lines; adopt it. `destination`: a rejected mutation (legacy error flow).
 */
export type AvailabilityFailure = {
	checkout: ServerCheckout | null;
	destination: CheckoutAvailabilityIssue | null;
};

export type CheckoutFulfillmentResult =
	| { ok: true; checkout: ServerCheckout }
	| { ok: false; reason: "availability"; failure: AvailabilityFailure }
	| { ok: false; reason: "error"; error: string };

/**
 * Check that every line can still be fulfilled, before the shopper pays or leaves the
 * shipping step. Saleor reports stock in one of two ways, depending on the channel's
 * `useLegacyErrorFlow` setting, and this covers both:
 *
 * - Legacy flow: re-submitting the saved shipping address is rejected with
 *   `INSUFFICIENT_STOCK`. Paper cannot tell which flow a channel uses, so the re-submit stays.
 * - New flow: the mutation succeeds and the affected lines are listed in
 *   `checkout.problems` of the checkout it returns.
 *
 * The re-submit also makes Saleor recalculate discounts, which swaps a gift that ran out for one in
 * stock or drops it. A gift line still listed after that fails the check as an error: the shopper
 * cannot remove it, and trying again re-submits the address.
 *
 * When shipping is not required or no address exists, the checkout passed in is the one read,
 * so pass a live snapshot. The checkout Saleor answered with comes back either way: callers
 * adopt it, so the live `problems` in context decide what blocks.
 *
 * Any other failure (network, unexpected address error) is an error — pay/shipping must not
 * proceed. Charging after a failed check is how shoppers get authorized with no order.
 */
export async function validateCheckoutFulfillment(
	checkout: ServerCheckout,
	fallbackError: string,
): Promise<CheckoutFulfillmentResult> {
	let live = checkout;

	if (checkout.isShippingRequired && checkout.shippingAddress) {
		const result = await updateCheckoutShippingAddress(
			checkout.id,
			getAddressInputDataFromAddress(checkout.shippingAddress),
			false,
		);

		if (!result.ok) {
			if (result.fieldErrors?.length) {
				const destination = availabilityIssueFromFieldErrors(checkout.lines, result.fieldErrors);
				if (destination) {
					return { ok: false, reason: "availability", failure: { checkout: null, destination } };
				}
			}

			return {
				ok: false,
				reason: "error",
				error: result.error ?? result.fieldErrors?.[0]?.message ?? fallbackError,
			};
		}

		live = result.checkout;
	}

	if (stockLinesFromProblems(live).length > 0) {
		return { ok: false, reason: "availability", failure: { checkout: live, destination: null } };
	}

	// Saleor checks gift lines' stock when it creates the order, after the shopper has paid.
	if (unavailableGiftLineIds(live).length > 0) {
		return { ok: false, reason: "error", error: fallbackError };
	}

	return { ok: true, checkout: live };
}
