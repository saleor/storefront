import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import Stripe from "stripe";
import invariant from "ts-invariant";

export async function getStripeClient(saleorApiUrl: string) {
  const { secretKey } = await getStripeSecrets(saleorApiUrl);
  const stripeClient = new Stripe(secretKey, {
    // Stripe API Version; required value
    apiVersion: "2022-08-01",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });
  return stripeClient;
}

export const getStripeSecrets = async (saleorApiUrl: string) => {
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings({ saleorApiUrl, obfuscateEncryptedData: false });

  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");
  invariant(stripe.webhookSecret, "Webhook Secret key not defined");

  return {
    publishableKey: stripe.publishableKey,
    secretKey: stripe.secretKey,
    webhookSecret: stripe.webhookSecret,
  };
};
