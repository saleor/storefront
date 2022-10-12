import { PaymentMethodID } from "checkout-common";
import { defineMessages } from "react-intl";

export const paymentSectionMessages = defineMessages({
  paymentProviders: {
    defaultMessage: "Payment providers",
    id: "PaymentSection/messages/8YE5b7",
    description: "payment providers",
  },
});

export const paymentMethodsMessages = defineMessages<PaymentMethodID>({
  creditCard: {
    defaultMessage: "Credit card",
    id: "PaymentSection/messages/im88Fe",
    description: "credit card",
  },
  applePay: {
    defaultMessage: "Apple Pay",
    id: "PaymentSection/messages/p7Zg+S",
    description: "apple pay",
  },
  paypal: {
    defaultMessage: "PayPal",
    id: "PaymentSection/messages/jdRifS",
    description: "paypal",
  },
  dropin: {
    defaultMessage: "Drop in",
    id: "PaymentSection/messages/bFYz7Q",
    description: "dropin",
  },
  dummy: {
    defaultMessage: "Dummy",
    id: "PaymentSection/messages/xXCQ+K",
    description: "dummy payment method",
  },
});

export const paymentSectionLabels = defineMessages({
  paymentProviders: {
    defaultMessage: "payment providers",
    id: "PaymentSection/messages/FK5Bg/",
    description: "payment providers accessibility label",
  },
});
