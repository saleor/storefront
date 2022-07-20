import { CountryCode } from "@/checkout-storefront/graphql";

export interface Country {
  name: string;
  code: CountryCode;
}

export type Countries = Country[];

export const countries: Countries = [
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
