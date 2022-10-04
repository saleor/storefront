import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import invariant from "ts-invariant";

/**
  Webhooks endpoint for mollie payment gateway.
  It's called after any change in the payment (paid, expired, failed, refunded, etc.)
  https://docs.mollie.com/overview/webhooks
*/
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if ("id" in req.body) {
    const { id } = req.body;
    invariant(typeof id === "string", "id must be a string");
    const [paymentError, paymentData] = await unpackPromise(verifyPayment(id));

    if (paymentError) {
      console.error("Error while validating payment", { paymentError });
      res.status(500).json({ error: "error while validating payment" });
      return;
    }
    // Save transaction id from mollie in Saleor
    // Check if trasaction was already created in Saleor
    // If status of that transaction changed, update tramsaction in Saleor

    if (paymentData) {
      await updateOrCreateTransaction(paymentData.id, paymentData);

      res.status(200).send("ok");

      return;
    }
  }

  res.status(400).json({ error: "invalid request body" });
}

export default withSentry(handler);
