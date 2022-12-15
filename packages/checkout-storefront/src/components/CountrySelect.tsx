import { Select } from "@/checkout-storefront/components/Select";
import { CountryCode } from "@/checkout-storefront/graphql";
import { countries } from "@/checkout-storefront/lib/consts/countries";
import { getParsedLocaleData } from "@/checkout-storefront/lib/utils";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import React from "react";

interface CountrySelectProps {
  only?: CountryCode[];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only = [] }) => {
  const countryNames = new Intl.DisplayNames(
    [getParsedLocaleData(getQueryParams().locale).languageCode],
    { type: "region" }
  );

  const countriesToMap = only.length ? only : countries;

  const countryOptions = countriesToMap.map((countryCode) => ({
    value: countryCode,
    label: countryNames.of(countryCode),
  }));

  return (
    <Select
      name="countryCode"
      classNames={{ container: "flex-1 inline-block !w-auto" }}
      options={countryOptions}
      autocomplete="countryCode"
    />
  );
};
