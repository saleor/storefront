import { Customization, PaymentMethod, PaymentProvider } from "types/common";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "creditCard",
    name: "Credit card",
  },
  {
    id: "applePay",
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
      id: "partnerId", // To be used as reference to settings values in the backend
      label: "Partner ID", // TODO: change to intl message
      type: "string",
    },
    {
      id: "liveTestApiKey", // To be used as reference to settings values in the backend
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
      id: "merchantAccount",
      label: "Merchant Account",
      type: "string",
    },
    {
      id: "clientKey",
      label: "Client Key",
      type: "string",
    },
    {
      id: "supportedCurrencies",
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
      id: "buttonBgColorPrimary",
      label: "Button BG Primary",
      type: "color",
    },
    {
      id: "buttonBgColorHover",
      label: "Button BG Hover",
      type: "color",
    },
    {
      id: "borderColorPrimary",
      label: "Border Primary",
      type: "color",
    },
    {
      id: "errorColor",
      label: "Error",
      type: "color",
    },
    {
      id: "successColor",
      label: "Success",
      type: "color",
    },
    {
      id: "buttonTextColor",
      label: "Button Text",
      type: "color",
    },
    {
      id: "textColor",
      label: "Text",
      type: "color",
    },
    {
      id: "logoUrl",
      label: "Logo",
      type: "image",
    },
  ],
};
export const sectionsCustomization: Customization<"productSettings"> = {
  id: "productSettings",
  label: "Product settings",
  settings: [
    {
      id: "lowStockThreshold",
      label: "Low stock treshold",
      type: "string",
    },
  ],
};
export const customizations = [brandingCustomization, sectionsCustomization];

export const appUrl = "https://" + process.env.VERCEL_URL;
