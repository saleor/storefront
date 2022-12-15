import { CountryCode, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { Locale } from "@/checkout-storefront/lib/regions";
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
