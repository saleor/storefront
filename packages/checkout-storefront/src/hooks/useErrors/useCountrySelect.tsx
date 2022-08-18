import { CountryCode } from "@/checkout-storefront/graphql";
import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { countries } from "@/checkout-storefront/sections/Addresses/countries";
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

  const getInitialCountryCode = (): CountryCode => {
    const defaultCountryCode = countries[0]?.code;

    if (!autoSelect && selectedCountryCode) {
      return selectedCountryCode;
    }

    const countryCodeFromUrl = getQueryVariables().countryCode;

    if (!countryCodeFromUrl || !countries.map(({ code }) => code).includes(countryCodeFromUrl)) {
      return defaultCountryCode as CountryCode;
    }

    return countryCodeFromUrl;
  };

  const [countryCode, setCountryCode] = useState(getInitialCountryCode());

  return {
    countryOptions,
    countryCode,
    setCountryCode,
  };
};
