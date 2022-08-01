import {
  AddressFragment,
  AddressInput,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { isEqual, omit } from "lodash-es";
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

export const isMatchingAddress =
  (address?: AddressFragment | null) => (addressToMatch?: AddressFragment | null) =>
    isEqual(omit(address, "id"), omit(addressToMatch, "id"));
