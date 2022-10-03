import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { createDebug } from "@/saleor-app-checkout/utils/debug";
import Stripe from "stripe";
import invariant from "ts-invariant";

const debug = createDebug("stripeClient")

export async function getStripeClient(domain: string) {
  const { secretKey } = await getStripeSecrets(domain);
  const stripeClient = new Stripe(secretKey, {
    // Stripe API Version; required value
    apiVersion: "2022-08-01",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });
  return stripeClient;
}

export const getStripeSecrets = async (domain: string) => {
  debug(`getStripeSecrets called with domain: ${domain}`)
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings(`https://${domain}/graphql/`, false);
  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");
  invariant(stripe.webhookSecret, "Webhook secret key not defined");

  debug(`Is client configured? ${!!stripe.publishableKey && !!stripe.secretKey && !!stripe.webhookSecret}`)
  return {
    publishableKey: stripe.publishableKey,
    secretKey: stripe.secretKey,
    webhookSecret: stripe.webhookSecret,
  };
};
