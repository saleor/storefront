import {
  AddressFragment,
  AddressInput,
  CheckoutAddressValidationRules,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { AddressField, ApiAddressField } from "@/checkout-storefront/lib/globalTypes";
import { isEqual, omit, reduce, uniq } from "lodash-es";
import { Address, AddressFormData, UserAddressFormData } from "./types";

export const emptyFormData = {
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
  countryCode: "",
};

export const getAddressInputData = ({
  countryCode,
  country,
  ...rest
}: Partial<
  AddressFormData & {
    countryCode?: CountryCode;
    country: CountryDisplay;
  }
>): AddressInput => ({
  ...omit(rest, ["id", "__typename"]),
  country: countryCode || (country?.code as CountryCode),
});

export const getAddressFormDataFromAddress = (address: Address): AddressFormData => {
  if (!address) {
    return emptyFormData as AddressFormData;
  }

  const { country, ...rest } = address;

  const parsedAddressBase = reduce(
    rest,
    (result, val, key) => ({ ...result, [key]: val || "" }),
    {}
  ) as Omit<AddressFormData, "countryCode">;

  return {
    ...parsedAddressBase,
    countryCode: country.code as CountryCode,
  };
};

export const getUserAddressFormDataFromAddress = (
  address: AddressFragment
): UserAddressFormData => {
  const { id } = address;
  const formData = getAddressFormDataFromAddress(address);
  return { id, ...formData };
};

export const isMatchingAddress = (
  address?: AddressFragment | null,
  addressToMatch?: AddressFragment | null
) => {
  const isTheSameAddressById =
    typeof address?.id === "string" &&
    typeof addressToMatch?.id === "string" &&
    address.id === addressToMatch.id;

  if (isTheSameAddressById) {
    return true;
  }

  return isEqual(omit(address, "id"), omit(addressToMatch, "id"));
};

export const getMatchingAddressFromList =
  (addressList: AddressFragment[] = []) =>
  (addressToMatch: Address) => {
    if (!addressToMatch) {
      return undefined;
    }

    return addressList.find((address) => isMatchingAddress(address, addressToMatch));
  };

export const isMatchingAddressFormData = (
  address?: Partial<AddressFormData> | null,
  addressToMatch?: Partial<AddressFormData> | null
) => isEqual(omit(address, ["id", "autoSave"]), omit(addressToMatch, ["id", "autoSave"]));

export const getAddressVlidationRulesVariables = (
  autoSave: boolean = false
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
  "phone",
  "streetAddress1",
  "streetAddress2",
  "city",
  "postalCode",
  "cityArea",
  "countryArea",
];

// api doesn't order the fields but we want to
export const getOrderedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
  const filteredAddressFields = getFilteredAddressFields(addressFields);

  return addressFieldsOrder.filter((orderedAddressField) =>
    filteredAddressFields.includes(orderedAddressField)
  );
};

export const getRequiredAddressFields = (requiredFields: AddressField[]): AddressField[] => [
  ...requiredFields,
  "firstName",
  "lastName",
];

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
export const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
  const filteredAddressFields = addressFields.filter(
    (addressField: ApiAddressField) => addressField !== "name"
  ) as AddressField[];

  return uniq([...filteredAddressFields, "firstName", "lastName"]);
};
