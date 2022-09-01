import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";

import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { getStripeSecrets } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";
import {
  verifyStripeEventSignature,
  stripeWebhookEventToTransactionCreateMutationVariables,
} from "@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler";
import type { Readable } from "node:stream";

// https://github.com/vercel/next.js/discussions/12517#discussioncomment-2929922
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const stripeWebhook: NextApiHandler = async (req, res) => {
  const { webhookSecret } = await getStripeSecrets();
  const sig = req.headers["stripe-signature"];

  if (typeof sig !== "string") {
    return res.status(400).json({ message: '"stripe-signature" header is missing' });
  }

  const body = await buffer(req);

  const [err, event] = await unpackPromise(verifyStripeEventSignature(body, sig, webhookSecret));

  if (err || !event) {
    return res.status(500).json({ message: err?.message });
  }

  const transactionData = await stripeWebhookEventToTransactionCreateMutationVariables(event);

  if (transactionData?.id) {
    const id = transactionData.id;
    await updateOrCreateTransaction(id, { ...transactionData, id });
  }

  return res.status(204).end();
};

export default withSentry(stripeWebhook);

export const config = {
  api: {
    // required for verification of the signature
    bodyParser: false,
  },
};
