import { NextApiRequest, NextApiResponse } from "next";
import { Types as AdyenTypes } from "@adyen/api-library";
import { OrderStatus as MollieOrderStatus } from "@mollie/api-client";

import { createMolliePayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { createOrder } from "@/saleor-app-checkout/backend/payments/createOrder";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types/common";
import { PaymentProviderID } from "checkout-common";
import { createAdyenPayment } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { getOrderDetails } from "@/saleor-app-checkout/backend/payments/getOrderDetails";
import {
  PayRequestResponse,
  PayRequestErrorResponse,
} from "@/saleor-app-checkout/types/api/pay";
import { PayRequestBody } from "checkout-common";
import { allowCors, getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { updatePaymentMetafield } from "@/saleor-app-checkout/backend/payments/updatePaymentMetafield";
import { verifyMollieSession } from "@/saleor-app-checkout/backend/payments/providers/mollie/verifySession";
import { verifyAdyenSession } from "@/saleor-app-checkout/backend/payments/providers/adyen/verifySession";

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

  if (body.provider === "mollie") {
    const appUrl = getBaseUrl(req);
    const { url, id } = await createMolliePayment({
      order,
      redirectUrl: body.redirectUrl,
      appUrl,
    });

    if (url) {
      const response: PayRequestResponse = {
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
      const response: PayRequestResponse = {
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
