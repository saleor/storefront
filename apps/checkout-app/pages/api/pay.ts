import { NextApiRequest, NextApiResponse } from "next";

import { createMolliePayment } from "@/checkout-app/backend/payments/providers/mollie";
import { createOrder } from "@/checkout-app/backend/payments/createOrder";
import { PaymentProviderID } from "@/checkout-app/types/common";
import { createAdyenPayment } from "@/checkout-app/backend/payments/providers/adyen";
import { OrderFragment } from "@/checkout-app/graphql";
import { getOrderDetails } from "@/checkout-app/backend/payments/getOrderDetails";
import {
  PayRequestBody,
  PayRequestResponse,
  PayRequestErrorResponse,
} from "@/checkout-app/types/api/pay";
import { allowCors, getBaseUrl } from "@/checkout-app/backend/utils";

const paymentProviders: PaymentProviderID[] = ["mollie", "adyen"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let body: PayRequestBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // check if correct provider was passed
  if (!paymentProviders.includes(body.provider)) {
    return res.status(400).json({
      ok: false,
      errors: ["UNKNOWN_PROVIDER"],
    } as PayRequestErrorResponse);
  }

  let order: OrderFragment;
  // check if order needs to be created
  if ("checkoutId" in body) {
    const data = await createOrder(body.checkoutId, body.totalAmount);

    if ("errors" in data) {
      return res.status(400).json({
        ok: false,
        errors: data.errors,
      } as PayRequestErrorResponse);
    }

    order = data.data;
  } else if ("orderId" in body) {
    const data = await getOrderDetails(body.orderId);

    if ("errors" in data) {
      return res.status(400).json({
        ok: false,
        errors: data.errors,
      } as PayRequestErrorResponse);
    }

    order = data.data;
  } else {
    return res.status(400).json({
      ok: false,
      errors: ["MISSING_CHECKOUT_OR_ORDER_ID"],
    } as PayRequestErrorResponse);
  }

  let response: PayRequestResponse;

  if (body.provider === "mollie") {
    const appUrl = getBaseUrl(req);
    const url = await createMolliePayment({
      order,
      redirectUrl: body.redirectUrl,
      appUrl,
    });

    if (url) {
      response = {
        ok: true,
        provider: "mollie",
        orderId: order.id,
        data: {
          paymentUrl: url.href,
        },
      };

      return res.status(200).json(response);
    }
  } else if (body.provider === "adyen") {
    const paymentUrl = await createAdyenPayment(order, body.redirectUrl);

    if (paymentUrl) {
      response = {
        ok: true,
        provider: "adyen",
        orderId: order.id,
        data: {
          paymentUrl,
        },
      };

      return res.status(200).json(response);
    }
  }

  res.status(400).json({ ok: false, orderId: order.id });
}

export default allowCors(handler);
