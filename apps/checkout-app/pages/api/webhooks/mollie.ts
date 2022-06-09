// https://docs.mollie.com/overview/webhooks

import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/checkout-app/backend/payments/providers/mollie";
import { createTransaction } from "@/checkout-app/backend/payments/createTransaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ("id" in req.body) {
    const paymentData = await verifyPayment(req.body.id);

    if (paymentData) {
      await createTransaction(paymentData);

      res.status(200).send("ok");

      return;
    }
  }

  res.status(400).json({ error: "invalid request body" });
}
