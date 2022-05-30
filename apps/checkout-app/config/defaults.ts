import {
  ChannelActivePaymentProvidersByChannel,
  CustomizationSettingsValues,
  PaymentProviderSettingsValues,
  PrivateSettingsValues,
  PublicSettingsValues,
} from "types/api";

export const defaultActiveChannelPaymentProviders: ChannelActivePaymentProvidersByChannel =
  {
    applePay: "",
    creditCard: "",
    paypal: "",
  };

export const defaultPaymentProviderSettings: PaymentProviderSettingsValues<"unencrypted"> =
  {
    mollie: {
      apiKey: "",
      profileId: "",
    },
    adyen: {
      merchantAccount: "",
      clientKey: "",
      apiKey: "",
      hmac: "",
      password: "",
      username: "",
    },
  };

export const defaultCustomizationSettings: CustomizationSettingsValues = {
  branding: {
    buttonBgColorPrimary: "#394052",
    buttonBgColorHover: "#394052",
    borderColorPrimary: "#FAFAFA",
    errorColor: "#B65757",
    successColor: "#2C9B2A",
    buttonTextColor: "#ffffff",
    textColor: "#000000",
    logoUrl: "",
  },
  productSettings: {
    lowStockThreshold: "",
  },
};

export const defaultPublicSettings: PublicSettingsValues = {
  customizations: defaultCustomizationSettings,
  channelActivePaymentProviders: {},
};
export const defaultPrivateSettings: PrivateSettingsValues<"unencrypted"> = {
  paymentProviders: defaultPaymentProviderSettings,
};
