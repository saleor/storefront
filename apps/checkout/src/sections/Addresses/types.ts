import { CountryCode } from "@/checkout/graphql";
import { AddressField } from "@/checkout/lib/globalTypes";

export interface AddressFormData
  extends Omit<
    Record<AddressField, string>,
    "country" | "countryCode" | "name"
  > {
  countryCode: CountryCode;
}

export interface UserAddressFormData extends AddressFormData {
  id: string;
}

export type UserDefaultAddressFragment =
  | null
  | undefined
  | { __typename?: "Address"; id: string };
