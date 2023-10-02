import { useMemo } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress,
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment, useCheckoutBillingAddressUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { type ChangeHandler } from "@/checkout/hooks/useForm";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm,
} from "@/checkout/sections/AddressList/useAddressListForm";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

export const useUserBillingAddressForm = () => {
	const { checkout } = useCheckout();
	const { billingAddress } = checkout;
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();

	const { user } = useUser();
	const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

	const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutBillingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutBillingUpdate",
				onSubmit: checkoutBillingAddressUpdate,
				shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
					!selectedAddressId ||
					isMatchingAddress(billingAddress, addressList.find(getById(selectedAddressId))),
				parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
					languageCode,
					checkoutId,
					validationRules: getAddressValidationRulesVariables(),
					billingAddress: getAddressInputDataFromAddress(
						addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment,
					),
				}),
				onFinished: () => setChangingBillingCountry(false),
			}),
			[billingAddress, checkoutBillingAddressUpdate, setChangingBillingCountry],
		),
	);

	const { form, userAddressActions } = useAddressListForm({
		onSubmit,
		defaultAddress: user?.defaultBillingAddress,
		checkoutAddress: checkout.billingAddress,
	});

	const onChange: ChangeHandler = (event) => {
		setChangingBillingCountry(true);
		form.handleChange(event);
	};

	return { form: { ...form, handleChange: onChange }, userAddressActions };
};
