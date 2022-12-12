import {
  AddressFragment,
  AddressInput,
  CheckoutAddressValidationRules,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { AddressField, ApiAddressField } from "@/checkout-storefront/lib/globalTypes";
import { isEqual, omit, pick, reduce, uniq } from "lodash-es";
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

// This is a workaround for the lack of Exact<> types in TypeScript
// We create an object with all fields required and then get keys of that object
// to get a list of all required fields.
// And then we use that list to pick the data that will be used in the mutation.
type AddressValidation = {
  [K in keyof AddressInput]-?: true;
};
const addressValidation: AddressValidation = {
  city: true,
  cityArea: true,
  companyName: true,
  country: true,
  countryArea: true,
  firstName: true,
  lastName: true,
  phone: true,
  postalCode: true,
  streetAddress1: true,
  streetAddress2: true,
};
const fieldsToKeep = Object.keys(addressValidation) as unknown as keyof AddressValidation[];

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
  return {
    ...pick(rest, fieldsToKeep),
    country: countryCode || (country?.code as CountryCode),
  };
};

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

export const getAddressValidationRulesVariables = (
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

  return uniq([...filteredAddressFields, "firstName", "lastName", "phone"]);
};
