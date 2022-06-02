import { NextApiRequest, NextApiResponse } from "next";

import { createMolliePayment } from "@/backend/payments/providers/mollie";
import { createOrder } from "@/backend/payments/createOrder";
import { allowCors } from "@/backend/utils";
import { PaymentProviderID } from "@/types/common";
import { Errors } from "@/backend/payments/types";
import { createAdyenPayment } from "@/backend/payments/providers/adyen";

const paymentProviders: PaymentProviderID[] = ["mollie", "adyen"];

export type Body = {
  provider: PaymentProviderID;
  checkoutId: string;
  totalAmount: number;
  redirectUrl: string;
  // captureAmount?: number; // support for partial payments
};

export type MollieResponse = {
  provider: "mollie";
  data: {
    paymentUrl: string;
  };
};

export type AdyenResponse = {
  provider: "adyen";
  data: {
    paymentUrl: string;
  };
};

export type SuccessResponse = {
  provider: PaymentProviderID;
  ok: true;
  orderId: string;
} & (MollieResponse | AdyenResponse);

export type ErrorResponse = {
  ok: false;
  orderId?: string;
  errors: Errors;
};

export type Response = SuccessResponse | ErrorResponse;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let body: Body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // check if correct provider was passed
  if (!paymentProviders.includes(body.provider)) {
    return res.status(400).json({ ok: false, errors: ["UNKNOWN_PROVIDER"] });
  }

  const order = await createOrder(body.checkoutId, body.totalAmount);

  if ("errors" in order) {
    return res.status(400).json({
      ok: false,
      errors: order.errors,
    });
  }

  let response: Response;

  if (body.provider === "mollie") {
    const url = await createMolliePayment(order.data, body.redirectUrl);

    if (url) {
      response = {
        ok: true,
        provider: "mollie",
        orderId: order.data.id,
        data: {
          paymentUrl: url.href,
        },
      };

      return res.status(200).json(response);
    }
  } else if (body.provider === "adyen") {
    const paymentUrl = await createAdyenPayment(order.data, body.redirectUrl);

    if (paymentUrl) {
      response = {
        ok: true,
        provider: "adyen",
        orderId: order.data.id,
        data: {
          paymentUrl,
        },
      };

      return res.status(200).json(response);
    }
  }

  res.status(400).json({ ok: false, orderId: order.data.id });
}

export default allowCors(handler);
