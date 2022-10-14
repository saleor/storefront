import {
  AdyenProviderSettingID,
  MollieProviderSettingID,
  PaymentProviderID,
  StripeProviderSettingID,
} from "checkout-common";
import { defineMessages } from "react-intl";

export const paymentProvidersMessages = defineMessages<PaymentProviderID>({
  mollie: {
    defaultMessage: "Mollie",
    id: "messages/paymentProviders/CQH/Vb",
    description: "payment provider",
  },
  adyen: {
    defaultMessage: "Adyen",
    id: "messages/paymentProviders/m5P19o",
    description: "payment provider",
  },
  stripe: {
    defaultMessage: "Stripe",
    id: "messages/paymentProviders/ehp06H",
    description: "payment provider",
  },
  dummy: {
    defaultMessage: "Dummy Payment",
    id: "messages/paymentProviders/LtD8zn",
    description: "dummy payment provider",
  },
});

export const molliePaymentProviderMessages = defineMessages<MollieProviderSettingID>({
  profileId: {
    defaultMessage: "Profile ID",
    id: "messages/paymentProviders/t7YEMr",
    description: "payment provider setting",
  },
  apiKey: {
    defaultMessage: "API key",
    id: "messages/paymentProviders/9hBUgM",
    description: "payment provider setting",
  },
});

export const adyenPaymentProviderMessages = defineMessages<AdyenProviderSettingID>({
  merchantAccount: {
    defaultMessage: "Merchant account",
    id: "messages/paymentProviders/ufY8+j",
    description: "payment provider setting",
  },
  apiKey: {
    defaultMessage: "Private API key",
    id: "messages/paymentProviders/qHRtb0",
    description: "payment provider setting",
  },
  hmac: {
    defaultMessage: "Webhook HMAC key",
    id: "messages/paymentProviders/+1my3D",
    description: "payment provider setting",
  },
  username: {
    defaultMessage: "Webhook username",
    id: "messages/paymentProviders/I6I7xw",
    description: "payment provider setting",
  },
  password: {
    defaultMessage: "Webhook password",
    id: "messages/paymentProviders/CH2iz9",
    description: "payment provider setting",
  },
  clientKey: {
    defaultMessage: "Public client key",
    id: "messages/paymentProviders/WdX1+f",
    description: "payment provider setting",
  },
});

export const stripePaymentProviderMessages = defineMessages<StripeProviderSettingID>({
  publishableKey: {
    defaultMessage: "Publishable Key",
    id: "messages/paymentProviders/YBcvvL",
    description: "payment provider setting",
  },
  secretKey: {
    defaultMessage: "Secret Key",
    id: "messages/paymentProviders/fQ20+Q",
    description: "payment provider setting",
  },
  webhookSecret: {
    defaultMessage: "Webhookd Secret",
    id: "messages/paymentProviders/glq8nA",
    description: "payment provider setting",
  },
});

export const dummyPaymentProviderMessages = defineMessages<StripeProviderSettingID>({
  publishableKey: {
    defaultMessage: "Publishable Key",
    id: "messages/paymentProviders/YBcvvL",
    description: "payment provider setting",
  },
  secretKey: {
    defaultMessage: "Secret Key",
    id: "messages/paymentProviders/fQ20+Q",
    description: "payment provider setting",
  },
  webhookSecret: {
    defaultMessage: "Webhookd Secret",
    id: "messages/paymentProviders/glq8nA",
    description: "payment provider setting",
  },
});
