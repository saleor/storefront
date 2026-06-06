import { updateCheckoutBillingAddress } from "@/app/(checkout)/actions";
import { getAddressInputData } from "@/checkout/components/address-form/utils";
import { type CountryCode, type AddressFragment } from "@/checkout/graphql";
import { getBillingAddressOptions } from "@/checkout/lib/billing-addresses";
import { getBillingSaveAddressFlag } from "@/checkout/lib/shipping-address-submit";
import { type BillingAddressData } from "@/checkout/components/payment";

export type BillingUpdateResult =
	| { ok: true }
	| { ok: false; errors: Record<string, string>; focusField?: string };

type UpdateBillingParams = {
	checkoutId: string;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	billingData: BillingAddressData;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
};

/** Persists billing address on checkout before payment. */
export async function updateCheckoutBilling(params: UpdateBillingParams): Promise<BillingUpdateResult> {
	const {
		checkoutId,
		sameAsBilling,
		hasShippingAddress,
		billingData,
		shippingAddress,
		userAddresses,
		authenticated,
	} = params;

	const needsBillingForm = !sameAsBilling || !hasShippingAddress;

	if (needsBillingForm) {
		let addressInput;

		const billingAddressOptions = getBillingAddressOptions([...(userAddresses ?? [])], shippingAddress);
		if (billingData.selectedAddressId && billingAddressOptions.length > 0) {
			const selectedAddress = billingAddressOptions.find((addr) => addr.id === billingData.selectedAddressId);
			if (selectedAddress) {
				addressInput = getAddressInputData({
					firstName: selectedAddress.firstName || "",
					lastName: selectedAddress.lastName || "",
					streetAddress1: selectedAddress.streetAddress1 || "",
					streetAddress2: selectedAddress.streetAddress2 || "",
					companyName: selectedAddress.companyName || "",
					city: selectedAddress.city || "",
					postalCode: selectedAddress.postalCode || "",
					countryArea: selectedAddress.countryArea || "",
					phone: selectedAddress.phone || "",
					countryCode: selectedAddress.country?.code as CountryCode,
				});
			}
		}

		if (!addressInput) {
			addressInput = getAddressInputData({
				...billingData.formData,
				countryCode: billingData.countryCode,
			});
		}

		const savedAddressIds = new Set((userAddresses ?? []).map((a) => a.id));
		const saveAddress = getBillingSaveAddressFlag({
			isAuthenticated: authenticated,
			selectedAddressId: billingData.selectedAddressId ?? null,
			savedAddressIds,
		});

		const result = await updateCheckoutBillingAddress({
			checkoutId,
			billingAddress: addressInput,
			saveAddress,
		});

		if (!result.ok) {
			if (result.fieldErrors?.length) {
				const errorMap: Record<string, string> = {};
				result.fieldErrors.forEach((err) => {
					const field = err.field || "streetAddress1";
					errorMap[field] = err.message || "Invalid value";
				});
				return { ok: false, errors: errorMap, focusField: Object.keys(errorMap)[0] };
			}
			return { ok: false, errors: { billing: result.error ?? "Failed to update billing address" } };
		}

		return { ok: true };
	}

	if (shippingAddress) {
		const addressInput = getAddressInputData({
			firstName: shippingAddress.firstName || "",
			lastName: shippingAddress.lastName || "",
			streetAddress1: shippingAddress.streetAddress1 || "",
			streetAddress2: shippingAddress.streetAddress2 || "",
			companyName: shippingAddress.companyName || "",
			city: shippingAddress.city || "",
			postalCode: shippingAddress.postalCode || "",
			countryArea: shippingAddress.countryArea || "",
			phone: shippingAddress.phone || "",
			countryCode: shippingAddress.country?.code as CountryCode,
		});

		const result = await updateCheckoutBillingAddress({
			checkoutId,
			billingAddress: addressInput,
			saveAddress: false,
		});

		if (!result.ok) {
			return {
				ok: false,
				errors: { billing: result.error ?? "Failed to update billing address" },
			};
		}
	}

	return { ok: true };
}
