import { CountryCode } from "@/checkout-storefront/graphql";
import { defineMessages } from "react-intl";

export const countriesMessages = defineMessages<Extract<"PL" | "US" | "FR" | "NL", CountryCode>>({
  PL: {
    defaultMessage: "Poland",
    id: "AddressForm/messages/IHMZ2N",
    description: "poland",
  },
  US: {
    defaultMessage: "United States of America",
    id: "AddressForm/messages/xQAA6W",
    description: "usa",
  },
  NL: {
    defaultMessage: "Netherlands",
    id: "AddressForm/messages/9BsfhB",
    description: "netherlands",
  },
  FR: {
    defaultMessage: "France",
    id: "AddressForm/messages/PwM0Kj",
    description: "france",
  },
});
