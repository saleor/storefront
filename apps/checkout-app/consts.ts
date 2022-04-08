import { Customization, PaymentMethod, PaymentProvider } from "types/common";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "credit-card",
    name: "Credit card",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
  },
  {
    id: "paypal",
    name: "PayPal",
  },
];

export const molliePaymentProvider: PaymentProvider<"mollie"> = {
  id: "mollie",
  label: "Mollie",
  settings: [
    {
      id: "partner-id", // To be used as reference to settings values in the backend
      label: "Partner ID", // TODO: change to intl message
      type: "string",
    },
    {
      id: "live-test-api-key", // To be used as reference to settings values in the backend
      label: "Live Test API Key", // TODO: change to intl message
      type: "string",
    },
  ],
};
export const adyenPaymentProvider: PaymentProvider<"adyen"> = {
  id: "adyen",
  label: "Adyen",
  settings: [
    {
      id: "merchant-account",
      label: "Merchant Account",
      type: "string",
    },
    {
      id: "client-key",
      label: "Client Key",
      type: "string",
    },
    {
      id: "supported-currencies",
      label: "Supported Currencies",
      type: "string",
    },
  ],
};
export const paymentProviders = [molliePaymentProvider, adyenPaymentProvider];

export const brandingCustomization: Customization<"branding"> = {
  id: "branding",
  label: "Branding",
  settings: [
    {
      id: "active",
      label: "Active",
      type: "color",
      value: "#394052", // Default value
    },
    {
      id: "text",
      label: "Text",
      type: "color",
    },
    {
      id: "bg",
      label: "BG",
      type: "color",
    },
    {
      id: "error",
      label: "Error",
      type: "color",
    },
    {
      id: "success",
      label: "Success",
      type: "color",
    },
    {
      id: "logo",
      label: "Logo",
      type: "image",
    },
  ],
};
export const sectionsCustomization: Customization<"product-settings"> = {
  id: "product-settings",
  label: "Product settings",
  settings: [
    {
      id: "low-stock-threshold",
      label: "Low stock treshold",
      type: "string",
    },
  ],
};
export const customizations = [brandingCustomization, sectionsCustomization];

export const appUrl = "https://" + process.env.VERCEL_URL;
