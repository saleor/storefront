import { AddressField } from "@lib/globalTypes";

export type AddressFormData = Omit<Record<AddressField, string>, "country">;

export interface UserAddressFormData extends AddressFormData {
  id: string;
}
