import { encryptSetting } from "@/saleor-app-checkout/backend/configuration/encryption";
import { PaymentProviderSettingsValues } from "@/saleor-app-checkout/types";
import { testingVars } from "../consts";

export const mollieCompletedOrderId = "ord_kr6ltl";

export const paymentProviders: PaymentProviderSettingsValues<"encrypted"> = {
  mollie: {
    apiKey: encryptSetting(testingVars.mollieKey),
    profileId: {
      encrypted: false,
      value: testingVars.mollieProfileId,
    },
  },
  adyen: {
    merchantAccount: {
      encrypted: false,
      value: testingVars.adyenMerchantAccount,
    },
    clientKey: {
      encrypted: false,
      value: testingVars.adyenClientKey,
    },
    apiKey: encryptSetting(testingVars.adyenApiKey),
    hmac: encryptSetting(testingVars.adyenHmac),
    password: encryptSetting(testingVars.adyenWebhookPassword),
    username: encryptSetting(testingVars.adyenWebhookUsername),
  },
  stripe: {
    secretKey: encryptSetting(testingVars.stripeSecretKey),
    webhookSecret: encryptSetting(testingVars.stripeWebhookSecret),
    publishableKey: {
      encrypted: false,
      value: testingVars.stripePublishableKey,
    },
  },
};

export const appPrivateMetafields = {
  paymentProviders,
};
