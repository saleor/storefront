import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { MightNotExist } from "@/checkout-storefront/lib/globalTypes";

export interface AddressFormData
  extends Omit<Record<AddressField, string>, "country" | "countryCode"> {
  countryCode: CountryCode;
}

export type OptionalAddress = MightNotExist<AddressFragment>;

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
