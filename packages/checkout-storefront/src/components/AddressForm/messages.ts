import { AddressField } from "@/checkout-storefront/components/AddressForm/types";
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
    id: "AddressForm/messages/XI2F1P",
    description: "province",
  },
  district: {
    defaultMessage: "District",
    id: "AddressForm/messages/X/8oa4",
    description: "district",
  },
  state: {
    defaultMessage: "State",
    id: "AddressForm/messages/Zdvjjr",
    description: "state",
  },
  zip: {
    defaultMessage: "Zip code",
    id: "AddressForm/messages/tGSbvd",
    description: "zip code",
  },
  postal: {
    defaultMessage: "Postal code",
    id: "AddressForm/messages/0KU6nT",
    description: "postal code",
  },
  postTown: {
    defaultMessage: "Post town",
    id: "AddressForm/messages/OxxX1m",
    description: "post town",
  },
});

export const addressFieldMessages = defineMessages<AddressFieldLabel>({
  city: { defaultMessage: "City", id: "AddressForm/messages/X51P1g", description: "city" },
  firstName: {
    defaultMessage: "First name",
    id: "AddressForm/messages/Jbz2k6",
    description: "first name",
  },
  countryArea: {
    defaultMessage: "Country area",
    id: "AddressForm/messages/dxC3yk",
    description: "country area",
  },
  lastName: {
    defaultMessage: "Last name",
    id: "AddressForm/messages/K/a8rS",
    description: "last name",
  },
  country: {
    defaultMessage: "Country",
    id: "AddressForm/messages/KyH9NK",
    description: "country",
  },
  cityArea: {
    defaultMessage: "City area",
    id: "AddressForm/messages/7bJ7Hd",
    description: "city area",
  },
  postalCode: {
    defaultMessage: "Postal code",
    id: "AddressForm/messages/0KU6nT",
    description: "postal code",
  },
  companyName: {
    defaultMessage: "Company",
    id: "AddressForm/messages/QXvSmh",
    description: "company",
  },
  streetAddress1: {
    defaultMessage: "Street address",
    id: "AddressForm/messages/Y6dLvp",
    description: "street address",
  },
  streetAddress2: {
    defaultMessage: "Street address (continue)",
    id: "AddressForm/messages/mbEUWh",
    description: "street address continue",
  },
  phone: {
    defaultMessage: "Phone number",
    id: "AddressForm/messages/ljLaVr",
    description: "phone number",
  },
});
