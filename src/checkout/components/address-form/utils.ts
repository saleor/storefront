import { isEqual, omit, pick, reduce, uniq } from "lodash-es";
import {
	type OptionalAddress,
	type AddressField,
	type AddressFormData,
	type ApiAddressField,
} from "../../components/address-form/types";
import { getCountryName } from "@/checkout/lib/utils/locale";
import {
	type AddressFragment,
	type AddressInput,
	type CheckoutAddressValidationRules,
	type CountryCode,
	type CountryDisplay,
} from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/global-types";

export const getEmptyAddressFormData = (): AddressFormData => ({
	firstName: "",
	lastName: "",
	streetAddress1: "",
	streetAddress2: "",
	companyName: "",
	city: "",
	cityArea: "",
	countryArea: "",
	postalCode: "",
	phone: "",
	countryCode: "US",
});

export const getEmptyAddress = (): AddressFragment => {
	const { countryCode, ...emptyAddressRest } = getEmptyAddressFormData();

	return {
		...emptyAddressRest,
		id: "",
		country: {
			code: countryCode,
			country: getCountryName(countryCode),
		},
	};
};

export const getAllAddressFieldKeys = () => Object.keys(getEmptyAddressFormData());

export const getAddressInputData = ({
	countryCode,
	country,
	...rest
}: Partial<
	AddressFormData & {
		countryCode?: CountryCode;
		country: CountryDisplay;
	}
>): AddressInput => {
	// Pick only address fields, then filter out empty strings
	const picked = pick(rest, getAllAddressFieldKeys());
	const filtered = reduce(
		picked,
		(result, value, key) => {
			// Only include non-empty values
			if (value !== undefined && value !== null && value !== "") {
				result[key] = value;
			}
			return result;
		},
		{} as Record<string, unknown>,
	);

	return {
		...filtered,
		country: countryCode || (country?.code as CountryCode),
	} as AddressInput;
};

export const getAddressInputDataFromAddress = (
	address: OptionalAddress | Partial<AddressFragment>,
): AddressInput => {
	if (!address) {
		return {};
	}

	const { country, phone, ...rest } = address;

	// Pick only address fields, then filter out empty/null values
	const picked = pick(rest, getAllAddressFieldKeys());
	const filtered = reduce(
		picked,
		(result, value, key) => {
			if (value !== undefined && value !== null && value !== "") {
				result[key] = value;
			}
			return result;
		},
		{} as Record<string, unknown>,
	);

	return {
		...filtered,
		country: country?.code as CountryCode,
		// Only include phone if it has a value
		...(phone ? { phone } : {}),
	} as AddressInput;
};

export const getAddressFormDataFromAddress = (address: OptionalAddress): AddressFormData => {
	if (!address) {
		return {
			...getEmptyAddressFormData(),
			countryCode: "US",
		};
	}

	const { country, ...rest } = address;

	const parsedAddressBase = reduce(rest, (result, val, key) => ({ ...result, [key]: val || "" }), {}) as Omit<
		AddressFormData,
		"countryCode"
	>;

	return pick(
		{
			...parsedAddressBase,
			countryCode: country.code as CountryCode,
		},
		getAllAddressFieldKeys(),
	) as AddressFormData;
};

// checks for address related data and id
export const isMatchingAddress = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null,
) => {
	const isTheSameAddressById =
		typeof address?.id === "string" &&
		typeof addressToMatch?.id === "string" &&
		address.id === addressToMatch.id;

	if (isTheSameAddressById) {
		return true;
	}

	return isMatchingAddressData(address, addressToMatch);
};

// checks only for address related data
export const isMatchingAddressData = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null,
) => isEqual(pick(address, getAllAddressFieldKeys()), pick(addressToMatch, getAllAddressFieldKeys()));

export const getByMatchingAddress =
	(addressToMatch: MightNotExist<Partial<AddressFragment>>) => (address: AddressFragment) =>
		isMatchingAddress(address, addressToMatch);

export const isMatchingAddressFormData = (
	address?: Partial<AddressFormData> | null,
	addressToMatch?: Partial<AddressFormData> | null,
) => {
	const propsToOmit = ["id", "autoSave", "__typename"];

	return isEqual(omit(address, propsToOmit), omit(addressToMatch, propsToOmit));
};

export const getAddressValidationRulesVariables = (
	{ autoSave }: { autoSave: boolean } = { autoSave: false },
): CheckoutAddressValidationRules =>
	autoSave
		? {
				checkRequiredFields: false,
			}
		: {};

export const addressFieldsOrder: AddressField[] = [
	"firstName",
	"lastName",
	"companyName",
	"streetAddress1",
	"streetAddress2",
	"city",
	"countryCode",
	"postalCode",
	"cityArea",
	"countryArea",
	"phone",
];

// api doesn't order the fields but we want to
export const getOrderedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
	const filteredAddressFields = getFilteredAddressFields(addressFields);

	return addressFieldsOrder.filter((orderedAddressField) =>
		filteredAddressFields.includes(orderedAddressField),
	);
};

export const getRequiredAddressFields = (requiredFields: AddressField[] = []): AddressField[] => [
	...requiredFields,
	"firstName",
	"lastName",
];

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
export const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
	const filteredAddressFields = addressFields.filter(
		(addressField: ApiAddressField) => addressField !== "name",
	) as AddressField[];

	return uniq([...filteredAddressFields, "firstName", "lastName", "phone"]);
};
