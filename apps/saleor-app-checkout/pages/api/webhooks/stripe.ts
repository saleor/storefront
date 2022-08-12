import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { StripeWebhookEvents } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeWebhookTypes";
import {
  getStripeClient,
  getStripeSecrets,
} from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";

/**
 * https://stripe.com/docs/webhooks
 */

const verifyStripeEventSignature = async (
  body: string | Buffer,
  signature: string,
  secret: string
) => {
  const stripeClient = await getStripeClient();
  return stripeClient.webhooks.constructEvent(body, signature, secret) as StripeWebhookEvents;
};

const stripeWebhook: NextApiHandler = async (req, res) => {
  const { webhookSecret } = await getStripeSecrets();
  const sig = req.headers["stripe-signature"];

  if (typeof sig !== "string") {
    return res.status(400).json({ message: '"stripe-signature" header is missing' });
  }

  const [err, event] = await unpackPromise(
    verifyStripeEventSignature(req.body, sig, webhookSecret)
  );

  if (err || !event) {
    return res.status(500).json({ message: err.message });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_failed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.expired":
      // event.data.object.id;
      // @todo update order status
      return;
  }

  return res.status(204).end();
};

export default stripeWebhook;

export const config = {
  api: {
    // required for verification of the signature
    bodyParser: false,
  },
};
