import {
  AddressFragment,
  AddressInput,
  CheckoutAddressValidationRules,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { isEqual, omit, reduce } from "lodash-es";
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

  const defaultValues = reduce(
    rest,
    (result, val, key) => ({ ...result, [key]: val || "" }),
    {}
  ) as Omit<AddressFormData, "countryCode">;

  return {
    ...defaultValues,
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
