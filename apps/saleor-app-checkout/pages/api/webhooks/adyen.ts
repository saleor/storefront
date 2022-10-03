// https://docs.adyen.com/development-resources/webhooks

import { withSentry } from "@sentry/nextjs";

import { Types } from "@adyen/api-library";

import { createTransaction } from "@/saleor-app-checkout/backend/payments/createTransaction";
import {
  getNewTransactionData,
  getOrderId,
  getUpdatedTransactionData,
  isNotificationDuplicate,
} from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { getOrderTransactions } from "@/saleor-app-checkout/backend/payments/getOrderTransactions";
import { updateTransaction } from "@/saleor-app-checkout/backend/payments/updateTransaction";
import { toNextHandler } from "retes/adapter";
import { Handler, Request } from "retes";
import { Response } from "retes/response";
import {
  AdyenRequestContext,
  AdyenRequestParams,
  isAdyenNotification,
  isAdyenWebhookAuthenticated,
  isAdyenWebhookHmacValid,
  withAdyenWebhookCredentials,
} from "@/saleor-app-checkout/backend/payments/providers/adyen/middlewares";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { createDebug } from "@/saleor-app-checkout/utils/debug";

const debug = createDebug("api/webhooks/adyen");

// TODO: Whats with this request type? :/
const handler: Handler = async (req: Request<AdyenRequestParams>) => {
  debug("Request received");
  const domain = req.params.domain;

  if (!domain) {
    debug("Can't return settings - missing domain");
    return Response.BadRequest("Missing domain");
  }
  const { apiKey } = req.context as AdyenRequestContext;
  const params = req.params;

  const notificationItem = params?.notificationItems?.[0]?.NotificationRequestItem;

  const [error] = await unpackPromise(notificationHandler(notificationItem, apiKey, domain));

  if (error) {
    console.warn("Error while saving Adyen notification");
    // Silent error - return OK, so Adyen won't send the webhook again
  }

  return Response.OK("[accepted]");
};

export default withSentry(
  toNextHandler([
    withAdyenWebhookCredentials,
    isAdyenWebhookAuthenticated,
    isAdyenNotification,
    isAdyenWebhookHmacValid,
    handler,
  ])
);

async function notificationHandler(
  notification: Types.notification.NotificationRequestItem,
  apiKey: string,
  domain: string
) {
  // Get order id from webhook metadata
  const orderId = await getOrderId(notification, apiKey);

  if (!orderId) {
    console.log("Order id not found");
    return;
  }

  // Get order transactions and run deduplication
  // https://docs.adyen.com/development-resources/webhooks/best-practices#handling-duplicates
  const transactions = await getOrderTransactions({ id: orderId }, domain);
  const duplicate = isNotificationDuplicate(transactions, notification);

  if (duplicate) {
    console.log("Ignored duplicated Adyen notification", notification);
    return;
  }

  // Check if originalReference exists, if it does append a new event
  if (notification.originalReference) {
    const transaction = transactions.find(
      ({ reference }) => reference === notification.originalReference
    );

    if (!transaction) {
      throw "originalReference does not exist in transactions";
    }

    const data = getUpdatedTransactionData(transaction, notification);

    await updateTransaction(data, domain);
  } else {
    const data = getNewTransactionData(orderId, notification);

    if (!data) {
      return;
    }

    await createTransaction(data, domain);
  }
}
