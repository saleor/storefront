import { defineMessages } from "react-intl";
import { PaymentMethodID } from "checkout-common";

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
