import { CountryCode } from "@/checkout-storefront/graphql";

export const countries: CountryCode[] = ["PL", "FR", "NL", "US"];

export const defaultCountry = countries[0] as CountryCode;

export const isValidCountryCode = (countryCode: CountryCode): boolean =>
  countries.map((code) => code).includes(countryCode);
