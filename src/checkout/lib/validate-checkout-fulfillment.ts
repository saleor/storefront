import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import { getAddressInputDataFromAddress } from "@/checkout/components/address-form/utils";
import {
	availabilityIssueFromFieldErrors,
	availabilityIssueFromProblems,
	type AvailabilityLine,
	type CheckoutAvailabilityIssue,
	type CheckoutProblemLike,
} from "@/checkout/lib/checkout-availability";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";

type FulfillmentCheckout = {
	id: string;
	isShippingRequired: boolean;
	shippingAddress?: Parameters<typeof getAddressInputDataFromAddress>[0] | null;
	problems?: ReadonlyArray<CheckoutProblemLike> | null;
	lines: ReadonlyArray<AvailabilityLine>;
};

export type CheckoutFulfillmentResult =
	| { ok: true }
	| {
			ok: false;
			reason: "availability";
			issue: CheckoutAvailabilityIssue;
			/**
			 * The checkout Saleor returned from the address re-submit, when the lines came from its
			 * `problems`. A caller whose context may hold an older snapshot puts it in context, so
			 * the banner and the Pay block read the live `problems` (a stock issue reported against
			 * an older snapshot lapses on the next render).
			 */
			checkout?: ServerCheckout;
	  }
	| { ok: false; reason: "error"; error: string };

/**
 * Check that every line can still be fulfilled, before the shopper pays or leaves the
 * shipping step. Saleor reports stock in one of two ways, depending on the channel's
 * `useLegacyErrorFlow` setting, and this covers both:
 *
 * - Legacy flow: re-submitting the saved shipping address is rejected with
 *   `INSUFFICIENT_STOCK`.
 * - New flow: the mutation succeeds and the affected lines are listed in
 *   `checkout.problems`.
 *
 * When shipping is not required or no address exists, only `checkout.problems` of the
 * checkout passed in is read, so pass a live snapshot.
 *
 * Stock failures become an availability issue. Any other failure (network, unexpected
 * address error) is an error — pay/shipping must not proceed. Charging after a failed
 * check is how shoppers get authorized with no order.
 */
export async function validateCheckoutFulfillment(
	checkout: FulfillmentCheckout,
	fallbackError: string,
): Promise<CheckoutFulfillmentResult> {
	if (!checkout.isShippingRequired || !checkout.shippingAddress) {
		const issue = availabilityIssueFromProblems(checkout.problems);
		return issue ? { ok: false, reason: "availability", issue } : { ok: true };
	}

	const result = await updateCheckoutShippingAddress(
		checkout.id,
		getAddressInputDataFromAddress(checkout.shippingAddress),
		false,
	);

	if (!result.ok) {
		if (result.fieldErrors?.length) {
			const issue = availabilityIssueFromFieldErrors(checkout.lines, result.fieldErrors);
			if (issue) {
				return { ok: false, reason: "availability", issue };
			}
		}

		return {
			ok: false,
			reason: "error",
			error: result.error ?? result.fieldErrors?.[0]?.message ?? fallbackError,
		};
	}

	const issue = availabilityIssueFromProblems(result.checkout.problems);
	return issue ? { ok: false, reason: "availability", issue, checkout: result.checkout } : { ok: true };
}
