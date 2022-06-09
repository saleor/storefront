import { PaymentMethodID } from "@/checkout-app/types/common";
import { defineMessages } from "react-intl";

export const paymentMethodsMessages = defineMessages<PaymentMethodID>({
  creditCard: {
    defaultMessage: "Credit card",
    description: "payment method",
  },
  applePay: {
    defaultMessage: "Apple Pay",
    description: "payment method",
  },
  paypal: {
    defaultMessage: "PayPal",
    description: "payment method",
  },
});
