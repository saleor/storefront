import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import Stripe from "stripe";
import invariant from "ts-invariant";

export async function getStripeClient() {
  const { secretKey } = await getStripeSecrets();
  const stripeClient = new Stripe(secretKey, { apiVersion: "2020-08-27" });
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
