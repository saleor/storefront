// https://docs.mollie.com/overview/webhooks

import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/backend/payments/providers/mollie";
import { createPayment } from "@/backend/payments/createPayment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ("id" in req.body) {
    const paymentData = await verifyPayment(req.body.id);

    if (paymentData) {
      await createPayment(paymentData);

      return res.status(200).json(true);
    }
  }

  res.status(400).json({ error: "invalid request body" });
}
