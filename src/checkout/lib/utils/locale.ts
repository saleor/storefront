import { type CountryCode } from "@/checkout/graphql";

/** Client-only href helper — not for SSR. */
export const getCurrentHref = () => location.href;

/**
 * Client-side region label — Node vs browser ICU can disagree (e.g. FK).
 * Country `<select>` options use server-hydrated labels from `ShippingCountryOption` instead.
 */
const countryNames = new Intl.DisplayNames("en-US", {
	type: "region",
});
export const getCountryName = (countryCode: CountryCode): string =>
	countryNames.of(countryCode) || countryCode;
