import {
  AddressFragment,
  AddressInput,
  CountryCode,
  CountryDisplay,
} from "@/checkout/graphql";
import { AddressField } from "@/checkout/lib/globalTypes";
import { intersection, isEqual, omit } from "lodash-es";
import { AddressFormData } from "./types";

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

export const getAddressFormDataFromAddress = (
  address?: AddressFragment | null
): Partial<AddressFormData> => {
  if (!address) {
    return {};
  }

  const { country, ...rest } = address;

  return {
    ...rest,
    countryCode: country.code as CountryCode,
  } as Partial<AddressFormData>;
};

export type AddressFormLayout = AddressFormLayoutField[];
export type AddressFormLayoutField = AddressField | AddressField[];

const addressFormLayout: AddressFormLayout = [
  ["firstName", "lastName"],
  "companyName",
  "phone",
  "streetAddress1",
  "streetAddress2",
  ["city", "postalCode"],
  "cityArea",
  "countryArea",
];

export const isAddressFieldRow = (formLayoutField: AddressFormLayoutField) =>
  Array.isArray(formLayoutField);

export const getAddressFormLayout = (orderedAdressFields: AddressField[]) =>
  addressFormLayout.reduce((result, layoutField) => {
    const shouldIncludeAddressField = isAddressFieldRow(layoutField)
      ? !!intersection(orderedAdressFields, layoutField).length
      : orderedAdressFields.includes(layoutField as AddressField);

    if (shouldIncludeAddressField) {
      return [...result, layoutField];
    }

    return result;
  }, [] as AddressFormLayout);

export const isMatchingAddress =
  (address?: AddressFragment | null) =>
  (addressToMatch?: AddressFragment | null) =>
    isEqual(omit(address, "id"), omit(addressToMatch, "id"));
