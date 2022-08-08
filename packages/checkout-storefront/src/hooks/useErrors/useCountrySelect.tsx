import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { countries, Country } from "@/checkout-storefront/sections/Addresses/countries";
import { useAddressAvailability } from "@/checkout-storefront/sections/Addresses/useAddressAvailability";
import { useMemo, useState } from "react";
import { Option } from "@saleor/ui-kit";
import sortBy from "lodash-es/sortBy";

interface CountryOption extends Option {
  value: CountryCode;
}

export interface UseCountrySelectProps {
  autoSelect: boolean;
  selectedCountryCode?: CountryCode | undefined;
  checkAddressAvailability?: boolean;
}

export interface UseCountrySelect {
  countryCode: CountryCode;
  setCountryCode: (countryCode: CountryCode) => void;
  setCountryCodeFromAddress: (address: AddressFragment) => void;
  countryOptions: CountryOption[];
}

export const useCountrySelect = ({
  autoSelect,
  selectedCountryCode,
  checkAddressAvailability = false,
}: UseCountrySelectProps): UseCountrySelect => {
  const { isAvailable } = useAddressAvailability({ pause: !checkAddressAvailability });

  const countryOptions: CountryOption[] = useMemo(
    () =>
      sortBy(
        countries.map(({ code, name }) => ({
          label: name,
          value: code,
          disabled: !isAvailable({ country: { code } }),
        })),
        "disabled"
      ),
    []
  );

  const getInitialCountryCode = () => {
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

  const [countryCode, setCountryCode] = useState<CountryCode>(getInitialCountryCode());

  const setCountryCodeFromAddress = (address?: AddressFragment | null) =>
    setCountryCode(address?.country?.code as CountryCode);

  return {
    countryOptions,
    countryCode,
    setCountryCode,
    setCountryCodeFromAddress,
  };
};
