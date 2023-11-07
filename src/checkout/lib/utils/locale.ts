import { type CountryCode } from "@/checkout/graphql";

export const getCurrentHref = () => location.href;

const countryNames = new Intl.DisplayNames("EN-US", {
	type: "region",
});
export const getCountryName = (countryCode: CountryCode): string =>
	countryNames.of(countryCode) || countryCode;
