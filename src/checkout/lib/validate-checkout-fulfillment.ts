import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import { getAddressInputDataFromAddress } from "@/checkout/components/address-form/utils";
import {
	availabilityIssueFromFieldErrors,
	type CheckoutAvailabilityIssue,
} from "@/checkout/lib/checkout-availability";

type FulfillmentCheckout = {
	id: string;
	isShippingRequired: boolean;
	shippingAddress?: Parameters<typeof getAddressInputDataFromAddress>[0] | null;
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
 * Re-submit the saved shipping address so Saleor re-checks warehouse stock
 * for this destination. No-ops when shipping is not required or no address exists.
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
		return { ok: true };
	}

	const result = await updateCheckoutShippingAddress(
		checkout.id,
		getAddressInputDataFromAddress(checkout.shippingAddress),
		false,
	);

	if (result.ok) {
		return { ok: true };
	}

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
