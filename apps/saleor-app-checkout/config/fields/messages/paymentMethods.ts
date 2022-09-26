import { defineMessages } from "react-intl";
import { PaymentMethodID } from "checkout-common";

export const paymentMethodsMessages = defineMessages<PaymentMethodID>({
  creditCard: {
    defaultMessage: "Credit card",
    id: "messages/paymentMethods/IKIBYk",
    description: "payment method",
  },
  applePay: {
    defaultMessage: "Apple Pay",
    id: "messages/paymentMethods/BFIFWS",
    description: "payment method",
  },
  paypal: {
    defaultMessage: "PayPal",
    id: "messages/paymentMethods/nXqPc7",
    description: "payment method",
  },
  dropin: {
    defaultMessage: "Drop-in",
    id: "messages/paymentMethods/6bexF4",
    description: "payment method",
  },
});
