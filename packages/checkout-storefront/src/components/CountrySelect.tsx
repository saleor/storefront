import { Select } from "@/checkout-storefront/components/Select";
import { CountryCode } from "@/checkout-storefront/graphql";
import { countries as allCountries } from "@/checkout-storefront/lib/consts/countries";
import { createGetCountryNames } from "@/checkout-storefront/lib/utils/locale";
import React from "react";

interface CountrySelectProps {
  only?: CountryCode[];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only = [] }) => {
  const getCountryName = createGetCountryNames();

  const countriesToMap = only.length ? only : allCountries;

  const countryOptions = countriesToMap.map((countryCode) => ({
    value: countryCode,
    label: getCountryName(countryCode),
  }));

  return (
    <Select
      name="countryCode"
      classNames={{ container: "flex-1 inline-block !w-auto" }}
      options={countryOptions}
      autoComplete="countryCode"
    />
  );
};
