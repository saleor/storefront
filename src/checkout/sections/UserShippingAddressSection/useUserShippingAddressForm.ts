import { useMemo } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress,
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment, useCheckoutShippingAddressUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm,
} from "@/checkout/sections/AddressList/useAddressListForm";

export const useUserShippingAddressForm = () => {
	const { checkout } = useCheckout();
	const { shippingAddress } = checkout;
	const { user } = useUser();
	const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

	const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutShippingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutShippingUpdate",
				onSubmit: checkoutShippingAddressUpdate,
				shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
					!selectedAddressId ||
					isMatchingAddress(shippingAddress, addressList.find(getById(selectedAddressId))),
				parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
					languageCode,
					checkoutId,
					validationRules: getAddressValidationRulesVariables(),
					shippingAddress: getAddressInputDataFromAddress(
						addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment,
					),
				}),
				onSuccess: ({ formHelpers: { resetForm }, formData }) => resetForm({ values: formData }),
			}),
			[checkoutShippingAddressUpdate, shippingAddress],
		),
	);

	const { form, userAddressActions } = useAddressListForm({
		onSubmit,
		defaultAddress: user?.defaultShippingAddress,
		checkoutAddress: shippingAddress,
	});

	return { form, userAddressActions };
};
