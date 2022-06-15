import { NextApiRequest, NextApiResponse } from "next";
import { Types as AdyenTypes } from "@adyen/api-library";
import { OrderStatus as MollieOrderStatus } from "@mollie/api-client";

import { allowCors } from "@/checkout-app/backend/utils";
import { getOrderPaymentDetails } from "@/checkout-app/backend/payments/getOrderPaymentDetails";
import { OrderPaymentMetafield } from "@/checkout-app/types";
import { verifyAdyenSession } from "@/checkout-app/backend/payments/providers/adyen/verifySession";
import { PaymentStatusResponse } from "@/checkout-app/types/api/payment-status";
import { verifyMollieSession } from "@/checkout-app/backend/payments/providers/mollie/verifySession";

const adyenHandler = async (
  sessionId: string
): Promise<PaymentStatusResponse> => {
  const session = await verifyAdyenSession(sessionId);

  const StatusEnum = AdyenTypes.checkout.PaymentLinkResource.StatusEnum;

  if (session.status === StatusEnum.Active) {
    // Session was previously generated but has not been completed
    return {
      status: "UNPAID",
      sessionLink: session.url,
    };
  } else if (
    [StatusEnum.Completed, StatusEnum.PaymentPending].includes(session.status)
  ) {
    // Session was successfully completed but Saleor has not yet registered the payment
    return {
      status: "PENDING",
    };
  } else if (session.status === StatusEnum.Expired) {
    return {
      status: "UNPAID",
    };
  } else {
    throw new Error("Session status unknown");
  }
};

const mollieHandler = async (
  sessionId: string
): Promise<PaymentStatusResponse> => {
  const session = await verifyMollieSession(sessionId);

  if (session.status === MollieOrderStatus.created) {
    // Session was previously generated but has not been completed
    return {
      status: "UNPAID",
      sessionLink: session.url,
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
    // Session was successfully completed but Saleor has not yet registered the payment
    return {
      status: "PENDING",
    };
  } else if (
    [MollieOrderStatus.expired, MollieOrderStatus.canceled].includes(
      session.status
    )
  ) {
    return {
      status: "UNPAID",
    };
  } else {
    throw new Error("Session status unknown");
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  const orderId = req.query.orderId as string;

  const order = await getOrderPaymentDetails(orderId);

  if ("errors" in order) {
    return res.status(400).json({
      ok: false,
      errors: order.errors,
    });
  }

  let response: PaymentStatusResponse = {
    status: "UNPAID",
  };

  // INFO: This logic needs to be revisited for multi-payment flow
  if (
    order.data.isPaid ||
    order.data.authorizeStatus === "FULL" ||
    order.data.chargeStatus === "FULL"
  ) {
    response.status = "PAID";
  } else if (order.data.privateMetafield) {
    const data: OrderPaymentMetafield = JSON.parse(order.data.privateMetafield);

    if (data.provider === "adyen") {
      response = await adyenHandler(data.session);
    } else if (data.provider === "mollie") {
      response = await mollieHandler(data.session);
    }
  }

  res.status(200).json(response);
}

export default allowCors(handler);
