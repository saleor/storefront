import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Types as AdyenTypes } from "@adyen/api-library";
import { Order, OrderStatus as MollieOrderStatus } from "@mollie/api-client";

import { createMolliePayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { createOrder } from "@/saleor-app-checkout/backend/payments/createOrder";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types/common";
import { assertUnreachable, PaymentProviderID, PaymentProviders } from "checkout-common";
import { createAdyenPayment } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { getOrderDetails } from "@/saleor-app-checkout/backend/payments/getOrderDetails";
import { PayRequestResponse, PayRequestErrorResponse } from "@/saleor-app-checkout/types/api/pay";
import { PayRequestBody } from "checkout-common";
import { allowCors, getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { updatePaymentMetafield } from "@/saleor-app-checkout/backend/payments/updatePaymentMetafield";
import { verifyMollieSession } from "@/saleor-app-checkout/backend/payments/providers/mollie/verifySession";
import { verifyAdyenSession } from "@/saleor-app-checkout/backend/payments/providers/adyen/verifySession";
import { Errors } from "@/saleor-app-checkout/backend/payments/types";

class MissingUrlError extends Error {
  constructor(public provider: PaymentProviderID, public order: OrderFragment) {
    super(`Missing url! Provider: ${provider} | Order ID: ${order.id}`);
    Object.setPrototypeOf(this, MissingUrlError.prototype);
  }
}

class KnownPaymentError extends Error {
  constructor(public provider: PaymentProviderID, public errors: Errors) {
    super(`Missing url! Provider: ${provider} | Errors: ${errors.join(", ")}`);
    Object.setPrototypeOf(this, MissingUrlError.prototype);
  }
}

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
        [StatusEnum.Completed, StatusEnum.PaymentPending].includes(session.status)
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

const createOrderFromBodyOrId = async (body: PayRequestBody): Promise<OrderFragment> => {
  const provider = body.provider;

  if ("checkoutId" in body) {
    const data = await createOrder(body.checkoutId, body.totalAmount);

    if ("errors" in data) {
      throw new KnownPaymentError(provider, data.errors);
    }

    return data.data;
  } else if ("orderId" in body) {
    const data = await getOrderDetails(body.orderId);

    if ("errors" in data) {
      throw new KnownPaymentError(provider, data.errors);
    }

    return data.data;
  }

  throw new KnownPaymentError(provider, ["MISSING_CHECKOUT_OR_ORDER_ID"]);
};

const newHandler = async (body: PayRequestBody): Promise<PayRequestResponse> => {
  if (!PaymentProviders.includes(body.provider)) {
    throw new KnownPaymentError(body.provider, ["UNKNOWN_PROVIDER"]);
  }

  const order = await createOrderFromBodyOrId(body);

  if (order.privateMetafield) {
    const existingSessionResponse = await reuseExistingSession({
      orderId: order.id,
      privateMetafield: order.privateMetafield,
      provider: body.provider,
    });

    if (existingSessionResponse) {
      return existingSessionResponse;
    }
  }

  const { url, id } = await getPaymentUrlIdForProvider(body, order);

  if (!url) {
    throw new MissingUrlError(body.provider, order);
  }

  const response: PayRequestResponse = {
    ok: true,
    provider: body.provider,
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

  return response;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const body: PayRequestBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  try {
    const response = await newHandler(body);
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof KnownPaymentError) {
      return res.status(400).json({
        ok: false,
        provider: err.provider,
        errors: err.errors,
      } as PayRequestErrorResponse);
    }

    if (err instanceof MissingUrlError) {
      return res.status(503).json({ ok: false, provider: err.provider, orderId: err.order.id });
    }

    return res.status(500).json({ ok: false, provider: body.provider });
  }
};

const getPaymentUrlIdForProvider = (
  body: PayRequestBody,
  order: OrderFragment
): Promise<{ url?: string | undefined; id: string }> => {
  switch (body.provider) {
    case "mollie":
      return createAdyenPayment(order, body.redirectUrl);
    case "adyen":
      return createAdyenPayment(order, body.redirectUrl);
    case "stripe":
      // @todo
      return {} as any;
    default:
      assertUnreachable(body.provider);
  }
};

export default allowCors(handler);
