import { AddressTypeEnum, CountryCode } from "@/graphql";
import { AddressField } from "@/lib/globalTypes";

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
