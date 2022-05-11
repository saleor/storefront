import { CountryCode } from "@/graphql";

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
  {
    code: "GB",
    name: "Great Britain",
  },
  {
    code: "US",
    name: "United States",
  },
];
