import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { countries, Country } from "@/checkout-storefront/sections/Addresses/countries";
import { useState } from "react";

export interface UseCountrySelectProps {
  autoSelect: boolean;
  selectedCountryCode?: CountryCode | undefined;
}

export interface UseCountrySelect {
  countryCode: CountryCode;
  setCountryCode: (countryCode: CountryCode) => void;
  setCountryCodeFromAddress: (address: AddressFragment) => void;
}

export const useCountrySelect = ({
  autoSelect,
  selectedCountryCode,
}: UseCountrySelectProps): UseCountrySelect => {
  const getAutoSelectedCode = () => {
    const defaultCountryCode = (countries[0] as Country).code;

    if (!autoSelect && selectedCountryCode) {
      return selectedCountryCode as CountryCode;
    }

    const countryCodeFromUrl = getQueryVariables().countryCode;

    if (!countryCodeFromUrl || !countries.map(({ code }) => code).includes(countryCodeFromUrl)) {
      return defaultCountryCode;
    }

    return countryCodeFromUrl;
  };

  const [countryCode, setCountryCode] = useState<CountryCode>(getAutoSelectedCode());

  const setCountryCodeFromAddress = (address?: AddressFragment | null) =>
    setCountryCode(address?.country?.code as CountryCode);

  return { countryCode, setCountryCode, setCountryCodeFromAddress };
};
