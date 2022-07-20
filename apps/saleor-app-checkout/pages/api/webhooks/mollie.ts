import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";

/**
  Webhooks endpoint for mollie payment gateway.
  It's called after any change in the payment (paid, expired, failed, refunded, etc.)
  https://docs.mollie.com/overview/webhooks
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ("id" in req.body) {
    const paymentData = await verifyPayment(req.body.id);
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
