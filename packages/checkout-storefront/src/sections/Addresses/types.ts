import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";

export interface AddressFormData
  extends Omit<Record<AddressField, string>, "country" | "countryCode" | "name"> {
  countryCode: CountryCode;
  autoSave?: boolean;
}

export interface UserAddressFormData extends AddressFormData {
  id: string;
}

export type Address = AddressFragment | undefined | null;
