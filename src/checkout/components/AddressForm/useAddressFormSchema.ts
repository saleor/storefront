import { useCallback, useMemo, useState } from "react";
import { mixed, object, string } from "yup";
import { type AddressField } from "@/checkout/components/AddressForm/types";
import { useAddressFormUtils } from "@/checkout/components/AddressForm/useAddressFormUtils";
import { type CountryCode } from "@/checkout/graphql";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";

export const useAddressFormSchema = (initialCountryCode?: CountryCode) => {
	const { errorMessages } = useErrorMessages();
	const [countryCode, setCountryCode] = useState(initialCountryCode);
	const { allowedFields, requiredFields } = useAddressFormUtils(countryCode);

	const getFieldValidator = useCallback(
		(field: AddressField) => {
			if (field === "countryCode") {
				return mixed<CountryCode>().required(errorMessages.required);
			}

			return requiredFields.includes(field) ? string().required(errorMessages.required) : string();
		},
		[errorMessages.required, requiredFields],
	);

	const validationSchema = useMemo(
		() =>
			allowedFields.reduce(
				(schema, field) => schema.concat(object().shape({ [field]: getFieldValidator(field) })),
				object().shape({}),
			),
		[allowedFields, getFieldValidator],
	);

	return { validationSchema, setCountryCode };
};
