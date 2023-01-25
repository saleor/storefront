import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";

export interface AddressFormData
  extends Omit<Record<AddressField, string>, "country" | "countryCode"> {
  countryCode: CountryCode;
}

export type OptionalAddress = AddressFragment | undefined | null;

export type AddressField =
  | "city"
  | "firstName"
  | "lastName"
  | "countryArea"
  | "cityArea"
  | "postalCode"
  | "countryCode"
  | "companyName"
  | "streetAddress1"
  | "streetAddress2"
  | "phone";

export type ApiAddressField = AddressField | "name";
