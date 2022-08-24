import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";

/**
  Webhooks endpoint for mollie payment gateway.
  It's called after any change in the payment (paid, expired, failed, refunded, etc.)
  https://docs.mollie.com/overview/webhooks
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if ("id" in req.body) {
    const [paymentError, paymentData] = await unpackPromise(verifyPayment(req.body.id));

    console.log({ paymentError });

    if (paymentError) {
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
