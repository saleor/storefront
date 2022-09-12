import { CountryCode } from "@/checkout-storefront/graphql";
import { countries } from "@/checkout-storefront/sections/Addresses/countries";
import { useAddressAvailability } from "@/checkout-storefront/sections/Addresses/useAddressAvailability";
import { useMemo } from "react";
import { Option } from "@saleor/ui-kit";
import sortBy from "lodash-es/sortBy";
import { getLocalizationDataFromUrl } from "@/checkout-storefront/lib/utils";
import { AddressFormData } from "@/checkout-storefront/sections/Addresses/types";

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

export const useCountrySelectProps = ({
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
    [isAvailable]
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
