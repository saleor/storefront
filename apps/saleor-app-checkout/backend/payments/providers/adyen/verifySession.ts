import { CheckoutAPI, Client } from "@adyen/api-library";

import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";

export const verifyAdyenSession = async (session: string) => {
  const {
    paymentProviders: { adyen },
  } = await getPrivateSettings(envVars.apiUrl, false);

  if (!adyen.apiKey) {
    throw "API key not defined";
  }

  // TODO: Remove hardcoded environment value
  // https://app.clickup.com/t/2549495/SALEOR-7263
  const client = new Client({
    apiKey: adyen.apiKey,
    environment: "TEST",
  });

  const checkout = new CheckoutAPI(client);

  const { status, url } = await checkout.getPaymentLinks(session);

  return { status, url };
};
