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
    description: "payment provider",
  },
  adyen: {
    defaultMessage: "Adyen",
    description: "payment provider",
  },
  stripe: {
    defaultMessage: "Stripe",
    description: "payment provider",
  },
});

export const molliePaymentProviderMessages = defineMessages<MollieProviderSettingID>({
  profileId: {
    defaultMessage: "Profile ID",
    description: "payment provider setting",
  },
  apiKey: {
    defaultMessage: "API key",
    description: "payment provider setting",
  },
});

export const adyenPaymentProviderMessages = defineMessages<AdyenProviderSettingID>({
  merchantAccount: {
    defaultMessage: "Merchant account",
    description: "payment provider setting",
  },
  apiKey: {
    defaultMessage: "Private API key",
    description: "payment provider setting",
  },
  hmac: {
    defaultMessage: "Webhook HMAC key",
    description: "payment provider setting",
  },
  username: {
    defaultMessage: "Webhook username",
    description: "payment provider setting",
  },
  password: {
    defaultMessage: "Webhook password",
    description: "payment provider setting",
  },
  clientKey: {
    defaultMessage: "Public client key",
    description: "payment provider setting",
  },
});

export const stripePaymentProviderMessages = defineMessages<StripeProviderSettingID>({
  publishableKey: {
    defaultMessage: "Publishable Key",
    description: "payment provider setting",
  },
  secretKey: {
    defaultMessage: "Secret Key",
    description: "payment provider setting",
  },
  webhookSecret: {
    defaultMessage: "Webhookd Secret",
    description: "payment provider setting",
  },
});
