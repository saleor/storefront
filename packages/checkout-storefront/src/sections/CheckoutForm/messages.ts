import { defineMessages } from "react-intl";

export const checkoutFormMessages = defineMessages({
  pay: {
    defaultMessage: "Pay",
    id: "CheckoutForm/messages/jLJToZ",
    description: "pay",
  },
  missingFieldsInShippingAddress: {
    defaultMessage: "There are certain fields in shipping address form that are missing or invalid",
    id: "CheckoutForm/messages/guvzy3",
    description: "missing fields in shipping address",
  },
  missingFieldsInBillingAddress: {
    defaultMessage: "There are certain fields in billing form that are missing or invalid",
    id: "CheckoutForm/messages/+qM8r0",
    description: "missing fields in billing address",
  },
});

export const checkoutFormLabels = defineMessages({
  pay: {
    defaultMessage: "pay",
    id: "CheckoutForm/messages/UDs7fN",
    description: "pay accessibility label",
  },
});

export const checkoutFinalizeMessages = defineMessages({
  emailRequiredOrInvalid: {
    defaultMessage: "Please provide a valid email before finalizing checkout",
    id: "CheckoutForm/messages/rVGqj8",
    description: "checkout finalize email required error",
  },
  shippingAddressInvalid: {
    defaultMessage: "Please fill in a valid shipping address before finalizing checkout",
    id: "CheckoutForm/messages/Em5uvP",
    description: "checkout finalize - shipping address invalid error",
  },
  billingAddressInvalid: {
    defaultMessage: "Please fill in a valid billing address before finalizing checkout",
    id: "CheckoutForm/messages/1G0La/",
    description: "checkout finalize - shipping address invalid error",
  },
});
