import { omit } from "lodash-es";
import { useMemo, useEffect } from "react";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout/graphql";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables,
} from "@/checkout/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import {
	type AutoSaveAddressFormData,
	useAutoSaveAddressForm,
} from "@/checkout/hooks/useAutoSaveAddressForm";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";

export const useGuestShippingAddressForm = () => {
	const {
		checkout: { shippingAddress },
	} = useCheckout();

	const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("shippingAddress");

	const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutShippingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutShippingUpdate",
				onSubmit: checkoutShippingAddressUpdate,
				parse: ({ languageCode, checkoutId, ...rest }) => ({
					languageCode,
					checkoutId,
					shippingAddress: getAddressInputData(omit(rest, "channel")),
					validationRules: getAddressValidationRulesVariables({ autoSave: true }),
				}),
				onSuccess: ({ data, formHelpers }) => {
					void setCheckoutFormValidationState({
						...formHelpers,
						values: getAddressFormDataFromAddress(data.checkout?.shippingAddress),
					});
				},
			}),
			[checkoutShippingAddressUpdate, setCheckoutFormValidationState],
		),
	);

	// Get initial values with US as default country to pre-load shipping options
	const getInitialValues = useMemo(() => {
		if (shippingAddress) {
			return getAddressFormDataFromAddress(shippingAddress);
		}

		// Return default address with US country to trigger shipping method loading
		return {
			...getAddressFormDataFromAddress(null),
			countryCode: "US" as const,
		};
	}, [shippingAddress]);

	const form = useAutoSaveAddressForm({
		onSubmit,
		initialValues: getInitialValues,
		scope: "checkoutShippingUpdate",
	});

	useCheckoutFormValidationTrigger({
		form,
		scope: "shippingAddress",
	});

	// Auto-submit with US country when no shipping address exists to pre-load shipping methods
	useEffect(() => {
		if (!shippingAddress && form.values.countryCode === "US") {
			// Only submit if we have the minimum required fields for shipping calculation
			const hasMinimumFields = form.values.countryCode;
			if (hasMinimumFields) {
				form.handleSubmit();
			}
		}
	}, [shippingAddress, form]);

	return form;
};
