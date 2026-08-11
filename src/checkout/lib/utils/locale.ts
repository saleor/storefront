import { type CountryCode } from "@/checkout/graphql";
import { ENGLISH_COUNTRY_NAMES, type EnglishCountryCode } from "@/checkout/lib/consts/english-country-names";

export const getCurrentHref = () => location.href;

function isEnglishCountryCode(code: string): code is EnglishCountryCode {
	return Object.hasOwn(ENGLISH_COUNTRY_NAMES, code);
}

/**
 * English country label for address selects.
 * Uses a static map so SSR (Node ICU) and the browser never disagree —
 * `Intl.DisplayNames` CLDR differs across runtimes (e.g. FK).
 */
export const getCountryName = (countryCode: CountryCode): string =>
	isEnglishCountryCode(countryCode) ? ENGLISH_COUNTRY_NAMES[countryCode] : countryCode;
