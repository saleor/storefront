import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { defineMessages } from "react-intl";

export type LocalizedAddressFieldLabel =
  | "province"
  | "district"
  | "state"
  | "zip"
  | "postal"
  | "postTown";

export type AddressFieldLabel = Exclude<AddressField, "countryCode"> | "country";

export const localizedAddressFieldMessages = defineMessages<LocalizedAddressFieldLabel>({
  province: {
    defaultMessage: "Province",
    id: "useAddressFormUtils/messages/XI2F1P",
    description: "province",
  },
  district: {
    defaultMessage: "District",
    id: "useAddressFormUtils/messages/X/8oa4",
    description: "district",
  },
  state: {
    defaultMessage: "State",
    id: "useAddressFormUtils/messages/Zdvjjr",
    description: "state",
  },
  zip: {
    defaultMessage: "Zip code",
    id: "useAddressFormUtils/messages/tGSbvd",
    description: "zip code",
  },
  postal: {
    defaultMessage: "Postal code",
    id: "useAddressFormUtils/messages/0KU6nT",
    description: "postal code",
  },
  postTown: {
    defaultMessage: "Post town",
    id: "useAddressFormUtils/messages/OxxX1m",
    description: "post town",
  },
});

export const addressFieldMessages = defineMessages<AddressFieldLabel>({
  city: { defaultMessage: "City", id: "useAddressFormUtils/messages/X51P1g", description: "city" },
  firstName: {
    defaultMessage: "First name",
    id: "useAddressFormUtils/messages/Jbz2k6",
    description: "first name",
  },
  countryArea: {
    defaultMessage: "Country area",
    id: "useAddressFormUtils/messages/dxC3yk",
    description: "country area",
  },
  lastName: {
    defaultMessage: "Last name",
    id: "useAddressFormUtils/messages/K/a8rS",
    description: "last name",
  },
  country: {
    defaultMessage: "Country",
    id: "useAddressFormUtils/messages/KyH9NK",
    description: "country",
  },
  cityArea: {
    defaultMessage: "City area",
    id: "useAddressFormUtils/messages/7bJ7Hd",
    description: "city area",
  },
  postalCode: {
    defaultMessage: "Postal code",
    id: "useAddressFormUtils/messages/0KU6nT",
    description: "postal code",
  },
  companyName: {
    defaultMessage: "Company",
    id: "useAddressFormUtils/messages/QXvSmh",
    description: "company",
  },
  streetAddress1: {
    defaultMessage: "Street address",
    id: "useAddressFormUtils/messages/Y6dLvp",
    description: "street address",
  },
  streetAddress2: {
    defaultMessage: "Street address (continue)",
    id: "useAddressFormUtils/messages/mbEUWh",
    description: "street address continue",
  },
  phone: {
    defaultMessage: "Phone number",
    id: "useAddressFormUtils/messages/ljLaVr",
    description: "phone number",
  },
});
