import { omit } from "lodash-es";
import { useMemo } from "react";
import { useAddressFormUrlChange } from "@/checkout/components/AddressForm/useAddressFormUrlChange";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables,
} from "@/checkout/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout/graphql";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import {
	type AutoSaveAddressFormData,
	useAutoSaveAddressForm,
} from "@/checkout/hooks/useAutoSaveAddressForm";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

interface GuestBillingAddressFormProps {
	skipValidation: boolean;
}

export const useGuestBillingAddressForm = ({ skipValidation }: GuestBillingAddressFormProps) => {
	const {
		checkout: { billingAddress },
	} = useCheckout();
	const validationSchema = useAddressFormSchema();
	const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("billingAddress");
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();

	const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutBillingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutBillingUpdate",
				onSubmit: checkoutBillingAddressUpdate,
				onStart: ({ formData }) => {
					if (formData.countryCode !== billingAddress?.country.code) {
						setChangingBillingCountry(true);
					}
				},
				parse: ({ languageCode, checkoutId, ...rest }) => ({
					languageCode,
					checkoutId,
					billingAddress: getAddressInputData(omit(rest, ["channel"])),
					validationRules: getAddressValidationRulesVariables({ autoSave: true }),
				}),
				onSuccess: ({ data, formHelpers }) => {
					void setCheckoutFormValidationState({
						...formHelpers,
						values: getAddressFormDataFromAddress(data.checkout?.billingAddress),
					});
				},
				onFinished: () => {
					setChangingBillingCountry(false);
				},
			}),
			[
				billingAddress?.country.code,
				checkoutBillingAddressUpdate,
				setChangingBillingCountry,
				setCheckoutFormValidationState,
			],
		),
	);

	const form = useAutoSaveAddressForm({
		onSubmit,
		initialValues: getAddressFormDataFromAddress(billingAddress),
		validationSchema,
		scope: "checkoutBillingUpdate",
	});

	useAddressFormUrlChange(form);

	useCheckoutFormValidationTrigger({
		form,
		scope: "billingAddress",
		skip: skipValidation,
	});

	return form;
};
