import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import { getAddressInputDataFromAddress } from "@/checkout/components/address-form/utils";
import {
	availabilityIssueFromFieldErrors,
	availabilityIssueFromProblems,
	type CheckoutAvailabilityIssue,
	type CheckoutProblemLike,
} from "@/checkout/lib/checkout-availability";

type FulfillmentCheckout = {
	id: string;
	isShippingRequired: boolean;
	shippingAddress?: Parameters<typeof getAddressInputDataFromAddress>[0] | null;
	problems?: ReadonlyArray<CheckoutProblemLike> | null;
	lines: ReadonlyArray<{
		id: string;
		variant?: { name?: string | null } | null;
	}>;
};

export type CheckoutFulfillmentResult =
	| { ok: true }
	| { ok: false; reason: "availability"; issue: CheckoutAvailabilityIssue }
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
	let problems = checkout.problems;

	if (checkout.isShippingRequired && checkout.shippingAddress) {
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

		problems = result.checkout.problems;
	}

	const issue = availabilityIssueFromProblems(problems);
	if (issue) {
		return { ok: false, reason: "availability", issue };
	}

	return { ok: true };
}
