import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import invariant from "ts-invariant";
import Stripe from "stripe";
import { assertUnreachable } from "checkout-common";
import { ReuseExistingVendorSessionFn } from "../../types";

export const verifyStripeSession = async (session: string) => {
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings(envVars.apiUrl, false);

  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");

  const stripeClient = new Stripe(stripe.secretKey, { apiVersion: "2022-08-01" });

  const { status, url } = await stripeClient.checkout.sessions.retrieve(session);

  return { status, url };
};

export const reuseExistingStripeSession: ReuseExistingVendorSessionFn = async ({
  payment,
  orderId,
}) => {
  const session = await verifyStripeSession(payment.session);

  if (!session.status || !session.url) {
    return;
  }

  switch (session.status) {
    case "expired":
      return {
        ok: false,
        provider: payment.provider,
        orderId,
        errors: ["EXPIRED"],
      };
    case "complete":
      return {
        ok: false,
        provider: payment.provider,
        orderId,
        errors: ["ALREADY_PAID"],
      };
    case "open":
      return {
        ok: true,
        provider: payment.provider,
        orderId,
        data: {
          paymentUrl: session.url,
        },
      };
    default:
      assertUnreachable(session.status);
  }
};
