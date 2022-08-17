import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import Stripe from "stripe";
import invariant from "ts-invariant";

export async function getStripeClient() {
  const { secretKey } = await getStripeSecrets();
  const stripeClient = new Stripe(secretKey, {
    // Stripe API Version; required value
    apiVersion: "2022-08-01",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });
  return stripeClient;
}

export const getStripeSecrets = async () => {
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings(envVars.apiUrl, false);

  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");
  invariant(stripe.webhookSecret, "Secret key not defined");

  return {
    publishableKey: stripe.publishableKey,
    secretKey: stripe.secretKey,
    webhookSecret: stripe.webhookSecret,
  };
};
