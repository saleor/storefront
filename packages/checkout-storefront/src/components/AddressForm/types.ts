import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";

export interface AddressFormData
  extends Omit<Record<AddressField, string>, "country" | "countryCode"> {
  countryCode: CountryCode;
}

export type Address = AddressFragment | undefined | null;
