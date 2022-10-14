import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import invariant from "ts-invariant";
import { assertUnreachable } from "checkout-common";
import { ReuseExistingVendorSessionFn } from "../../types";
import { getStripeClient } from "./stripeClient";

export const verifyStripeSession = async ({
  saleorApiHost,
  session,
}: {
  saleorApiHost: string;
  session: string;
}) => {
  const {
    paymentProviders: { stripe },
  } = await getPrivateSettings({ saleorApiHost, obfuscateEncryptedData: false });

  invariant(stripe.publishableKey, "Publishable key not defined");
  invariant(stripe.secretKey, "Secret key not defined");

  const stripeClient = await getStripeClient(saleorApiHost);

  const { status, url } = await stripeClient.checkout.sessions.retrieve(session);

  return { status, url };
};

export const reuseExistingStripeSession: ReuseExistingVendorSessionFn = async (
  saleorApiHost,
  { payment, orderId }
) => {
  const session = await verifyStripeSession({ saleorApiHost, session: payment.session });

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
