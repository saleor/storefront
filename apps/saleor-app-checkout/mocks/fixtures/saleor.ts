import { encryptSetting } from "@/saleor-app-checkout/backend/configuration/encryption";
import { serverEnvVars } from "@/saleor-app-checkout/constants";
import { invariant } from "ts-invariant";
import { testingVars } from "../consts";

invariant(testingVars.mollieKey, "TEST_MOLLIE_KEY is not defined");
invariant(testingVars.mollieProfileId, "TEST_MOLLIE_PROFILE_ID is not defined");
invariant(serverEnvVars.settingsEncryptionSecret, "SETTINGS_ENCRYPTION_SECRET is not defined");

export const paymentProviders = {
  mollie: {
    apiKey: encryptSetting(testingVars.mollieKey),
    profileId: {
      encrypted: false,
      value: testingVars.mollieProfileId,
    },
    completedOrderId: "ord_kr6ltl",
  },
  adyen: {
    merchantAccount: {
      encrypted: false,
      value: testingVars.adyenMarchantAccount,
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
};

export const appPrivateMetafields = {
  paymentProviders,
};
