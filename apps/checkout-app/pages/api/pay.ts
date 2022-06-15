import { NextApiRequest, NextApiResponse } from "next";
import { Types as AdyenTypes } from "@adyen/api-library";
import { OrderStatus as MollieOrderStatus } from "@mollie/api-client";

import { createMolliePayment } from "@/checkout-app/backend/payments/providers/mollie";
import { createOrder } from "@/checkout-app/backend/payments/createOrder";
import {
  OrderPaymentMetafield,
  PaymentProviderID,
} from "@/checkout-app/types/common";
import { createAdyenPayment } from "@/checkout-app/backend/payments/providers/adyen";
import { OrderFragment } from "@/checkout-app/graphql";
import { getOrderDetails } from "@/checkout-app/backend/payments/getOrderDetails";
import {
  PayRequestBody,
  PayRequestResponse,
  PayRequestErrorResponse,
} from "@/checkout-app/types/api/pay";
import { allowCors, getBaseUrl } from "@/checkout-app/backend/utils";
import { updatePaymentMetafield } from "@/checkout-app/backend/payments/updatePaymentMetafield";
import { verifyMollieSession } from "@/checkout-app/backend/payments/providers/mollie/verifySession";
import { verifyAdyenSession } from "@/checkout-app/backend/payments/providers/adyen/verifySession";

const paymentProviders: PaymentProviderID[] = ["mollie", "adyen"];

const reuseExistingSession = async ({
  orderId,
  provider,
  privateMetafield,
}: {
  orderId: string;
  provider: PaymentProviderID;
  privateMetafield: string;
}): Promise<PayRequestResponse | undefined> => {
  const payment: OrderPaymentMetafield = JSON.parse(privateMetafield);

  if (payment.provider === provider && payment.session) {
    if (payment.provider === "mollie") {
      const session = await verifyMollieSession(payment.session);

      if (session.status === MollieOrderStatus.created && session.url) {
        return {
          ok: true,
          provider: payment.provider,
          orderId,
          data: {
            paymentUrl: session.url,
          },
        };
      } else if (
        [
          MollieOrderStatus.authorized,
          MollieOrderStatus.completed,
          MollieOrderStatus.paid,
          MollieOrderStatus.pending,
          MollieOrderStatus.shipping,
        ].includes(session.status)
      ) {
        return {
          ok: false,
          provider: payment.provider,
          orderId,
          errors: ["ALREADY_PAID"],
        };
      }
    } else if (payment.provider === "adyen") {
      const session = await verifyAdyenSession(payment.session);
      const StatusEnum = AdyenTypes.checkout.PaymentLinkResource.StatusEnum;

      if (session.status === StatusEnum.Active) {
        return {
          ok: true,
          provider: payment.provider,
          orderId,
          data: {
            paymentUrl: session.url,
          },
        };
      } else if (
        // Session was successfully completed but Saleor has not yet registered the payment
        [StatusEnum.Completed, StatusEnum.PaymentPending].includes(
          session.status
        )
      ) {
        return {
          ok: false,
          provider: payment.provider,
          orderId,
          errors: ["ALREADY_PAID"],
        };
      }
    }
  }
};

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

  if (order.privateMetafield) {
    const existingSessionResponse = await reuseExistingSession({
      orderId: order.id,
      privateMetafield: order.privateMetafield,
      provider: body.provider,
    });

    if (existingSessionResponse) {
      return res.status(200).json(existingSessionResponse);
    }
  }

  let response: PayRequestResponse;

  if (body.provider === "mollie") {
    const appUrl = getBaseUrl(req);
    const { url, id } = await createMolliePayment({
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
          paymentUrl: url,
        },
      };

      const payment: OrderPaymentMetafield = {
        provider: body.provider,
        session: id,
      };

      await updatePaymentMetafield(order.id, payment);

      return res.status(200).json(response);
    }
  } else if (body.provider === "adyen") {
    const { url, id } = await createAdyenPayment(order, body.redirectUrl);

    if (url) {
      response = {
        ok: true,
        provider: "adyen",
        orderId: order.id,
        data: {
          paymentUrl: url,
        },
      };

      const payment: OrderPaymentMetafield = {
        provider: body.provider,
        session: id,
      };

      await updatePaymentMetafield(order.id, payment);

      return res.status(200).json(response);
    }
  }

  res.status(400).json({ ok: false, orderId: order.id });
}

export default allowCors(handler);
