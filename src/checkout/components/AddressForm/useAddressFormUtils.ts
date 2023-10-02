import camelCase from "lodash-es/camelCase";
import { useCallback, useMemo } from "react";
import {
	type CountryCode,
	useAddressValidationRulesQuery,
	type ValidationRulesFragment,
} from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { warnAboutMissingTranslation } from "@/checkout/hooks/useFormattedMessages/utils";
import { type OptionalAddress, type AddressField } from "@/checkout/components/AddressForm/types";
import { defaultCountry } from "@/checkout/lib/consts/countries";
import {
	type AddressFieldLabel,
	addressFieldMessages,
	type LocalizedAddressFieldLabel,
	localizedAddressFieldMessages,
} from "@/checkout/components/AddressForm/messages";
import { getOrderedAddressFields, getRequiredAddressFields } from "@/checkout/components/AddressForm/utils";

export const useAddressFormUtils = (countryCode: CountryCode = defaultCountry) => {
	const formatMessage = useFormattedMessages();

	const [{ data }] = useAddressValidationRulesQuery({
		variables: { countryCode },
	});

	const validationRules = data?.addressValidationRules as ValidationRulesFragment;

	const { countryAreaType, postalCodeType, cityType } = validationRules || {};

	const localizedFields = useMemo(
		() => ({
			countryArea: countryAreaType,
			city: cityType,
			postalCode: postalCodeType,
		}),
		[cityType, countryAreaType, postalCodeType],
	);

	const isRequiredField = useCallback(
		(field: AddressField) =>
			getRequiredAddressFields(validationRules?.requiredFields as AddressField[]).includes(field),
		[validationRules?.requiredFields],
	);

	const getMissingFieldsFromAddress = useCallback(
		(address: OptionalAddress) => {
			if (!address) {
				return [];
			}

			return Object.entries(address).reduce((result, [fieldName, fieldValue]) => {
				if (!isRequiredField(fieldName as AddressField)) {
					return result;
				}

				return !!fieldValue ? result : ([...result, fieldName] as AddressField[]);
			}, [] as AddressField[]);
		},
		[isRequiredField],
	);

	const hasAllRequiredFields = useCallback(
		(address: OptionalAddress) => !getMissingFieldsFromAddress(address).length,
		[getMissingFieldsFromAddress],
	);

	const getLocalizedFieldLabel = useCallback(
		(field: AddressField, localizedField?: string) => {
			try {
				const translatedLabel = formatMessage(
					localizedAddressFieldMessages[camelCase(localizedField) as LocalizedAddressFieldLabel],
				);
				return translatedLabel;
			} catch (e) {
				warnAboutMissingTranslation(localizedField);
				return formatMessage(addressFieldMessages[camelCase(field) as AddressFieldLabel]);
			}
		},
		[formatMessage],
	);

	const getFieldLabel = useCallback(
		(field: AddressField) => {
			const localizedField = localizedFields[field as keyof typeof localizedFields];

			const isLocalizedField = !!localizedField && localizedField !== field;

			if (isLocalizedField) {
				return getLocalizedFieldLabel(
					field,
					localizedFields[field as keyof typeof localizedFields] as LocalizedAddressFieldLabel,
				);
			}

			return formatMessage(addressFieldMessages[field as AddressFieldLabel]);
		},
		[formatMessage, getLocalizedFieldLabel, localizedFields],
	);

	const orderedAddressFields = getOrderedAddressFields(validationRules?.allowedFields as AddressField[]);

	return {
		orderedAddressFields,
		getFieldLabel,
		isRequiredField,
		hasAllRequiredFields,
		getMissingFieldsFromAddress,
		...validationRules,
		allowedFields: validationRules?.allowedFields as AddressField[],
	};
};
