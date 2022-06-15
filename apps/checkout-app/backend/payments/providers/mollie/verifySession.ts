import { getPrivateSettings } from "@/checkout-app/backend/configuration/settings";
import { envVars } from "@/checkout-app/constants";

import { getMollieClient } from "./utils";

export const verifyMollieSession = async (session: string) => {
  const {
    paymentProviders: { mollie },
  } = await getPrivateSettings(envVars.apiUrl, false);

  if (!mollie.apiKey) {
    throw "API key not defined";
  }

  const client = await getMollieClient();
  const { status, _links } = await client.orders.get(session);

  return { status, url: _links.checkout?.href };
};
