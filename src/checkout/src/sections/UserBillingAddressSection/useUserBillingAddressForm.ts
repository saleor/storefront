import { useMemo } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress,
} from "@/checkout/src/components/AddressForm/utils";
import { type AddressFragment, useCheckoutBillingAddressUpdateMutation } from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { type ChangeHandler } from "@/checkout/src/hooks/useForm";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { useUser } from "@/checkout/src/hooks/useUser";
import { getById } from "@/checkout/src/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm,
} from "@/checkout/src/sections/AddressList/useAddressListForm";
import { useCheckoutUpdateStateActions } from "@/checkout/src/state/updateStateStore";

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
