import { CountryCode, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { Locale } from "@/checkout-storefront/lib/regions";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { snakeCase } from "lodash-es";

export const localeToLanguageCode = (locale: Locale) =>
  snakeCase(locale).toUpperCase() as LanguageCodeEnum;

export const getCurrentHref = () => location.href;

export const getParsedLocaleData = (
  locale: Locale
): { locale: Locale; countryCode: CountryCode; languageCode: LanguageCodeEnum } => {
  const [languageCode, countryCode] = locale?.split("-");

  return {
    countryCode: countryCode as CountryCode,
    locale,
    languageCode: languageCode as LanguageCodeEnum,
  };
};

export const createGetCountryNames = () => {
  const countryNames = new Intl.DisplayNames(
    [getParsedLocaleData(getQueryParams().locale).languageCode],
    { type: "region" }
  );

  return (countryCode: CountryCode): string => countryNames.of(countryCode) || countryCode;
};
