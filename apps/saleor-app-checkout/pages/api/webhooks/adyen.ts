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
import { Handler } from "retes";
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

const handler: Handler = async (req) => {
  const { apiKey } = req.context as AdyenRequestContext;
  const params = req.params as AdyenRequestParams;

  const notificationItem = params?.notificationItems?.[0]?.NotificationRequestItem;

  const [error] = await unpackPromise(notificationHandler(notificationItem, apiKey));

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
  apiKey: string
) {
  // Get order id from webhook metadata
  const orderId = await getOrderId(notification, apiKey);

  if (!orderId) {
    return;
  }

  // Get order transactions and run deduplication
  // https://docs.adyen.com/development-resources/webhooks/best-practices#handling-duplicates
  const transactions = await getOrderTransactions({ id: orderId });
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

    await updateTransaction(data);
  } else {
    const data = getNewTransactionData(orderId, notification);

    if (!data) {
      return;
    }

    await createTransaction(data);
  }
}
