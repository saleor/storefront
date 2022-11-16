// https://docs.adyen.com/development-resources/webhooks

import { Types } from "@adyen/api-library";

import { createTransaction } from "@/saleor-app-checkout/backend/payments/createTransaction";
import {
  getNewTransactionData,
  getUpdatedTransactionData,
  isNotificationDuplicate,
} from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { getOrderTransactions } from "@/saleor-app-checkout/backend/payments/getOrderTransactions";
import { updateTransaction } from "@/saleor-app-checkout/backend/payments/updateTransaction";
import { toNextHandler } from "retes/adapter";
import { Handler, Middleware } from "retes";
import { Response } from "retes/response";
import {
  AdyenRequestContext,
  AdyenRequestParams,
  isAdyenNotification,
  isAdyenWebhookAuthenticated,
  isAdyenWebhookHmacValid,
  withAdyenWebhookCredentials,
} from "@/saleor-app-checkout/backend/payments/providers/adyen/middlewares";
import { unpackPromise } from "@/saleor-app-checkout/utils/unpackErrors";
import { getOrderIdFromNotification } from "@/saleor-app-checkout/backend/payments/providers/adyen/getOrderIdFromNotification";

const handler: Handler<AdyenRequestParams> = async (request) => {
  const { apiKey } = request.context as AdyenRequestContext;

  const notificationItem = request.params?.notificationItems?.[0]?.NotificationRequestItem;

  const saleorApiUrl = request.params.saleorApiUrl;

  const [error] = await unpackPromise(
    notificationHandler({ saleorApiUrl, notification: notificationItem, apiKey })
  );

  if (error) {
    console.warn("Error while saving Adyen notification");
    // Silent error - return OK, so Adyen won't send the webhook again
  }

  return Response.OK("[accepted]");
};

export default toNextHandler([
  withAdyenWebhookCredentials as Middleware,
  isAdyenWebhookAuthenticated,
  isAdyenNotification,
  isAdyenWebhookHmacValid,
  handler as Handler,
]);

async function notificationHandler({
  saleorApiUrl,
  notification,
  apiKey,
}: {
  saleorApiUrl: string;
  notification: Types.notification.NotificationRequestItem;
  apiKey: string;
}) {
  // Get order id from webhook metadata
  const orderId = await getOrderIdFromNotification(notification, apiKey);

  if (!orderId) {
    console.log("Order id not found");
    return;
  }

  // Get order transactions and run deduplication
  // https://docs.adyen.com/development-resources/webhooks/best-practices#handling-duplicates
  const transactions = await getOrderTransactions(saleorApiUrl, { id: orderId });
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

    await updateTransaction(saleorApiUrl, data);
  } else {
    const data = getNewTransactionData(orderId, notification);

    if (!data) {
      return;
    }

    await createTransaction(saleorApiUrl, data);
  }
}
