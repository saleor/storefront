import { snakeCase } from "lodash-es";
import { type CountryCode, type LanguageCodeEnum } from "@/checkout/graphql";
import { type Locale } from "@/checkout/lib/regions";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const localeToLanguageCode = (locale: Locale) => snakeCase(locale).toUpperCase() as LanguageCodeEnum;

export const getCurrentHref = () => location.href;

export const getParsedLocaleData = (
	locale: Locale,
): { locale: Locale; countryCode: CountryCode; languageCode: LanguageCodeEnum } => {
	const [languageCode, countryCode] = locale?.split("-");

	return {
		countryCode: countryCode as CountryCode,
		locale,
		languageCode: languageCode as LanguageCodeEnum,
	};
};

export const createGetCountryNames = () => {
	const countryNames = new Intl.DisplayNames([getParsedLocaleData(getQueryParams().locale).languageCode], {
		type: "region",
	});

	return (countryCode: CountryCode): string => countryNames.of(countryCode) || countryCode;
};
