import { OrderStatus as MollieOrderStatus } from "@mollie/api-client";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";

import { getMollieClient } from "./utils";
import { ReuseExistingVendorSessionFn } from "../../types";

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

export const reuseExistingMollieSession: ReuseExistingVendorSessionFn = async ({
  payment,
  orderId,
}) => {
  const session = await verifyMollieSession(payment.session);

  if (session.status === MollieOrderStatus.created && session.url) {
    return {
      ok: true,
      provider: payment.provider,
      orderId,
      data: {
        paymentUrl: session.url,
      },
    };
  } else if (
    [
      MollieOrderStatus.authorized,
      MollieOrderStatus.completed,
      MollieOrderStatus.paid,
      MollieOrderStatus.pending,
      MollieOrderStatus.shipping,
    ].includes(session.status)
  ) {
    return {
      ok: false,
      provider: payment.provider,
      orderId,
      errors: ["ALREADY_PAID"],
    };
  } else {
    return;
  }
};
