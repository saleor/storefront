import camelCase from "lodash-es/camelCase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
export type LocalizedAddressFieldLabel =
	| "province"
	| "district"
	| "state"
	| "zip"
	| "postal"
	| "postTown"
	| "prefecture";

const BASE_FIELD_KEYS: Record<AddressFieldLabel, string> = {
	city: "city",
	firstName: "firstName",
	countryArea: "stateProvince",
	lastName: "lastName",
	country: "country",
	cityArea: "cityArea",
	postalCode: "postalCode",
	companyName: "companyOptional",
	streetAddress1: "streetAddress",
	streetAddress2: "streetAddress2Optional",
	phone: "phoneOptional",
};

const LOCALIZED_FIELD_KEYS: Record<LocalizedAddressFieldLabel, string> = {
	province: "localized.province",
	district: "localized.district",
	state: "localized.state",
	zip: "localized.zip",
	postal: "localized.postal",
	postTown: "localized.postTown",
	prefecture: "localized.prefecture",
};

export const useAddressFormUtils = (countryCode: CountryCode = defaultCountry) => {
	const t = useTranslations("account.fields");
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

	const getLocalizedFieldLabel = useCallback(
		(field: AddressField, localizedField?: string) => {
			const key = LOCALIZED_FIELD_KEYS[camelCase(localizedField) as LocalizedAddressFieldLabel];
			if (key) {
				return t(key as Parameters<typeof t>[0]);
			}
			return t(BASE_FIELD_KEYS[camelCase(field) as AddressFieldLabel] as Parameters<typeof t>[0]);
		},
		[t],
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

			return t(BASE_FIELD_KEYS[field as AddressFieldLabel] as Parameters<typeof t>[0]);
		},
		[getLocalizedFieldLabel, localizedFields, t],
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
