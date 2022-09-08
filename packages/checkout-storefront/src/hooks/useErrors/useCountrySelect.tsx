import { CountryCode } from "@/checkout-storefront/graphql";
import { countries } from "@/checkout-storefront/sections/Addresses/countries";
import { useAddressAvailability } from "@/checkout-storefront/sections/Addresses/useAddressAvailability";
import { useMemo, useState } from "react";
import { Option } from "@saleor/ui-kit";
import sortBy from "lodash-es/sortBy";
import { getLocalizationDataFromUrl } from "@/checkout-storefront/lib/utils";
import { Address, AddressFormData } from "@/checkout-storefront/sections/Addresses/types";
import { some } from "lodash-es";

interface CountryOption extends Option {
  value: CountryCode;
}

export interface UseCountrySelectProps {
  defaultFormData: AddressFormData;
  checkAddressAvailability?: boolean;
}

export interface UseCountrySelect {
  countryOptions: CountryOption[];
  initialCountryCode: CountryCode;
}

export const useCountrySelect = ({
  checkAddressAvailability = false,
  defaultFormData,
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

  const initialCountryCode = useMemo(() => {
    const countryCodeInOptions = countryOptions.find(
      ({ code }) => code === defaultFormData.countryCode
    )?.code;

    return (countryCodeInOptions as CountryCode) || getLocalizationDataFromUrl().country.code;
  }, [defaultFormData, countryOptions]);

  return {
    countryOptions,
    initialCountryCode,
  };
};
