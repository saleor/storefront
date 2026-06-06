import camelCase from "lodash-es/camelCase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAddressValidationRules } from "@/app/(checkout)/actions";
import { type CountryCode, type ValidationRulesFragment } from "@/checkout/graphql";
import { type OptionalAddress, type AddressField } from "@/checkout/components/address-form/types";
import { defaultCountry } from "@/checkout/lib/consts/countries";
import { getOrderedAddressFields, getRequiredAddressFields } from "@/checkout/components/address-form/utils";

const DEFAULT_ADDRESS_FIELDS: AddressField[] = [
	"firstName",
	"lastName",
	"companyName",
	"streetAddress1",
	"streetAddress2",
	"city",
	"postalCode",
	"countryArea",
	"phone",
];

export type AddressFieldLabel = Exclude<AddressField, "countryCode"> | "country";
export const addressFieldMessages: Record<AddressFieldLabel, string> = {
	city: "City",
	firstName: "First name",
	countryArea: "Country area",
	lastName: "Last name",
	country: "Country",
	cityArea: "City area",
	postalCode: "Postal code",
	companyName: "Company",
	streetAddress1: "Street address",
	streetAddress2: "Apartment, suite, etc.",
	phone: "Phone number",
};

export type LocalizedAddressFieldLabel =
	| "province"
	| "district"
	| "state"
	| "zip"
	| "postal"
	| "postTown"
	| "prefecture";
export const localizedAddressFieldMessages: Record<LocalizedAddressFieldLabel, string> = {
	province: "Province",
	district: "District",
	state: "State",
	zip: "Zip code",
	postal: "Postal code",
	postTown: "Post town",
	prefecture: "Prefecture",
};

export const useAddressFormUtils = (countryCode: CountryCode = defaultCountry) => {
	const [validationRules, setValidationRules] = useState<ValidationRulesFragment | undefined>();
	const [loadedCountry, setLoadedCountry] = useState<CountryCode | null>(null);
	const fetching = loadedCountry !== countryCode;

	useEffect(() => {
		let cancelled = false;

		void getAddressValidationRules(countryCode).then((result) => {
			if (cancelled) return;
			setValidationRules(result.ok ? result.rules : undefined);
			setLoadedCountry(countryCode);
		});

		return () => {
			cancelled = true;
		};
	}, [countryCode]);

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

	const getLocalizedFieldLabel = useCallback((field: AddressField, localizedField?: string) => {
		try {
			const translatedLabel =
				localizedAddressFieldMessages[camelCase(localizedField) as LocalizedAddressFieldLabel];
			return translatedLabel;
		} catch (e) {
			console.warn(`Missing translation: ${localizedField}`);
			return addressFieldMessages[camelCase(field) as AddressFieldLabel];
		}
	}, []);

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

			return addressFieldMessages[field as AddressFieldLabel];
		},
		[getLocalizedFieldLabel, localizedFields],
	);

	const orderedAddressFields = useMemo(() => {
		if (validationRules?.allowedFields) {
			return getOrderedAddressFields(validationRules.allowedFields as AddressField[]);
		}
		return DEFAULT_ADDRESS_FIELDS;
	}, [validationRules?.allowedFields]);

	return {
		orderedAddressFields,
		getFieldLabel,
		isRequiredField,
		hasAllRequiredFields,
		getMissingFieldsFromAddress,
		fetching,
		...validationRules,
		allowedFields: validationRules?.allowedFields as AddressField[] | undefined,
	};
};
