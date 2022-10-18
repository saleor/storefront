import { CountryCode } from "@/checkout-storefront/graphql";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { Locale } from "@/checkout-storefront/lib/regions";
import { getParsedLocaleData, getQueryParams } from "@/checkout-storefront/lib/utils";
import { useState } from "react";

interface UseLocale {
  locale: Locale;
  countryCode: CountryCode;
}

export const useLocale = (): UseLocale => {
  const { locale, countryCode } = getParsedLocaleData(getQueryParams().locale);

  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [currentCountryCode, setCurrentCountryCode] = useState<CountryCode>(countryCode);

  const handleChange = ({ queryParams }: UrlChangeHandlerArgs) => {
    const newQuery = getParsedLocaleData(queryParams.locale);
    setCurrentLocale(newQuery.locale);
    setCurrentCountryCode(newQuery.countryCode);
  };

  useUrlChange(handleChange);

  return { locale: currentLocale, countryCode: currentCountryCode };
};
