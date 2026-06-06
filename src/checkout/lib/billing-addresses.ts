import { type AddressFragment } from "@/checkout/graphql";
import { isMatchingAddressData } from "@/checkout/components/address-form/utils";

/**
 * Build the list of selectable billing addresses for logged-in users.
 * Includes checkout.shippingAddress when it isn't already in saved addresses
 * (e.g. newly entered on the information step before user cache refreshes).
 */
export function getBillingAddressOptions(
	userAddresses: AddressFragment[],
	shippingAddress?: AddressFragment | null,
): AddressFragment[] {
	if (!shippingAddress?.streetAddress1) {
		return userAddresses;
	}

	const alreadyIncluded = userAddresses.some((addr) => isMatchingAddressData(addr, shippingAddress));
	if (alreadyIncluded) {
		return userAddresses;
	}

	return [shippingAddress, ...userAddresses];
}
