import { channels } from "mocks/saleor";
import {
  ChannelActivePaymentProviders,
  CustomizationSettingsValues,
  PaymentProviderSettingsValues,
} from "types/api";

// Should be fetched from app backend
export const activePaymentProviders: ChannelActivePaymentProviders = {
  [channels[0].id]: {
    "credit-card": "mollie",
    "apple-pay": "mollie",
    paypal: "adyen",
  },
  [channels[1].id]: {
    "credit-card": "adyen",
    "apple-pay": "adyen",
    paypal: "mollie",
  },
};

// Should be fetched from app backend
export const paymentProviderSettingsValues: PaymentProviderSettingsValues = {
  mollie: {
    "partner-id": "",
    "live-test-api-key": "",
  },
  adyen: {
    "merchant-account": "",
    "client-key": "",
    "supported-currencies": "",
  },
};

// Should be fetched from app backend
export const customizationSettingsValues: CustomizationSettingsValues = {
  branding: {
    active: "#394052",
    text: "#394052",
    bg: "#FAFAFA",
    error: "#B65757",
    success: "#2C9B2A",
    logo: "",
  },
  "product-settings": {
    "low-stock-threshold": "",
  },
};
