import { Locale } from "@/checkout-storefront/lib/regions";
import { defineMessages } from "react-intl";

export const languagesMessages = defineMessages<Locale>({
  "en-US": {
    defaultMessage: "English (USA)",
    id: "PageHeader/messages/eXrxj4",
    description: "english usa",
  },
  "pl-PL": {
    defaultMessage: "Polish",
    id: "PageHeader/messages/kd+Ya5",
    description: "polish",
  },
});

export const headerMessages = defineMessages({
  goBackToCart: {
    defaultMessage: "Go back to cart",
    id: "PageHeader/messages/goBackToCart",
    description: "go back to cart label",
  },
});
