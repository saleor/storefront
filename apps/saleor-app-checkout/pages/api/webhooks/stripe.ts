import * as Sentry from "@sentry/nextjs";
import { NextApiHandler } from "next";

import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise, unpackThrowable } from "@/saleor-app-checkout/utils/unpackErrors";
import { getStripeSecrets } from "@/saleor-app-checkout/backend/payments/providers/stripe/stripeClient";
import {
  verifyStripeEventSignature,
  stripeWebhookEventToTransactionCreateMutationVariables,
} from "@/saleor-app-checkout/backend/payments/providers/stripe/webhookHandler";
import type { Readable } from "node:stream";
import { getSaleorApiUrlFromRequest } from "@/saleor-app-checkout/backend/auth";
import { MissingPaymentProviderSettingsError } from "@/saleor-app-checkout/backend/payments/errors";

// https://github.com/vercel/next.js/discussions/12517#discussioncomment-2929922
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const stripeWebhook: NextApiHandler = async (req, res) => {
  const [saleorApiUrlError, saleorApiUrl] = unpackThrowable(() => getSaleorApiUrlFromRequest(req));

  if (saleorApiUrlError) {
    res.status(400).json({ message: saleorApiUrlError.message });
    return;
  }

  const sig = req.headers["stripe-signature"];

  if (typeof sig !== "string") {
    return res.status(400).json({ message: '"stripe-signature" header is missing' });
  }

  const [stripeSecretsError, stripeSecrets] = await unpackPromise(getStripeSecrets(saleorApiUrl));

  if (stripeSecretsError) {
    console.error(stripeSecretsError);

    if (stripeSecretsError instanceof MissingPaymentProviderSettingsError) {
      res.status(500).json({ error: stripeSecretsError.message });
      return;
    }

    Sentry.captureException(stripeSecretsError);
    res.status(500).json({ error: "getStripeSecrets failed" });
    return;
  }

  const body = await buffer(req);

  const [verifyStripeEventSignatureError, event] = await unpackPromise(
    verifyStripeEventSignature({
      saleorApiUrl,
      body,
      signature: sig,
      secret: stripeSecrets.webhookSecret,
    })
  );

  if (verifyStripeEventSignatureError || !event) {
    console.error(verifyStripeEventSignatureError);
    Sentry.captureException(verifyStripeEventSignatureError);
    return res.status(500).json({ message: verifyStripeEventSignatureError?.message });
  }

  const transactionData = await stripeWebhookEventToTransactionCreateMutationVariables({
    saleorApiUrl,
    event,
  });

  if (transactionData?.id) {
    const id = transactionData.id;
    await updateOrCreateTransaction({
      saleorApiUrl,
      orderId: id,
      transactionData: { ...transactionData, id },
    });
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
