import { NextApiHandler } from "next";

import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { getStripeSecrets } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";
import {
  verifyStripeEventSignature,
  stripeWebhookEventToTransactionCreateMutationVariables,
} from "@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler";

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

  const transactionData = await stripeWebhookEventToTransactionCreateMutationVariables(event);

  if (transactionData?.id) {
    const id = transactionData.id;
    await updateOrCreateTransaction(id, { ...transactionData, id });
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
