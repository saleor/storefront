import { CountryCode } from "@/checkout-storefront/graphql";

export interface Country {
  name: string;
  code: CountryCode;
}

export const countries: Country[] = [
  {
    code: "PL",
    name: "Poland",
  },
  { code: "IT", name: "Italy" },
  {
    code: "GB",
    name: "Great Britain",
  },
  {
    code: "US",
    name: "United States",
  },
  {
    code: "NL",
    name: "Netherlands",
  },
];

export const defaultCountry = countries[0] as Country;

export const isValidCountryCode = (countryCode: CountryCode): boolean =>
  countries.map(({ code }) => code).includes(countryCode);

export const getCountryByCountryCode = (countryCode: CountryCode): Country => {
  if (!isValidCountryCode(countryCode)) {
    return defaultCountry;
  }

  return countries.find(({ code }) => code === countryCode) as Country;
};
