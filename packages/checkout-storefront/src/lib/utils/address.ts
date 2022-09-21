import {
  AddressFragment,
  AddressInput,
  CheckoutAddressValidationRules,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { AddressField, ApiAddressField } from "@/checkout-storefront/lib/globalTypes";
import { isEqual, omit, reduce, uniq } from "lodash-es";
import { Address, AddressFormData, UserAddressFormData } from "../../components/AddressForm/types";

export const emptyFormData: AddressFormData = {
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
  countryCode: "" as CountryCode,
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
    return emptyFormData;
  }

  const { country, ...rest } = address;

  const parsedAddressBase = reduce(
    rest,
    (result, val, key) => ({ ...result, [key]: val || "" }),
    {}
  ) as Omit<AddressFormData, "countryCode">;

  return omit(
    {
      ...parsedAddressBase,
      countryCode: country.code as CountryCode,
    },
    ["__typename"]
  ) as AddressFormData;
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
) => {
  const propsToOmit = ["id", "autoSave", "__typename"];

  return isEqual(omit(address, propsToOmit), omit(addressToMatch, propsToOmit));
};

export const getAddressVlidationRulesVariables = (
  autoSave = false
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
  "countryCode",
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

export const getRequiredAddressFields = (requiredFields: AddressField[] = []): AddressField[] => [
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
