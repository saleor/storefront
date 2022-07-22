// https://docs.adyen.com/development-resources/webhooks

import { hmacValidator, Types } from "@adyen/api-library";

import { createTransaction } from "@/saleor-app-checkout/backend/payments/createTransaction";
import {
  getNewTransactionData,
  getOrderId,
  getUpdatedTransactionData,
  isNotificationDuplicate,
} from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { getOrderTransactions } from "@/saleor-app-checkout/backend/payments/getOrderTransactions";
import { updateTransaction } from "@/saleor-app-checkout/backend/payments/updateTransaction";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import { toNextHandler } from "retes/adapter";
import { Handler } from "retes";
import { Response } from "retes/response";

const validator = new hmacValidator();

const isAdyenNotification = (params: {
  [key: string]: any;
}): params is Types.notification.Notification => {
  return typeof params?.live === "string" && Array.isArray(params?.notificationItems);
};

const validateNotificationItems = (
  { NotificationRequestItem }: Types.notification.NotificationItem,
  hmacKey: string
) => {
  // first validate the origin
  const valid = validator.validateHMAC(NotificationRequestItem, hmacKey);

  if (!valid) {
    throw "Invalid HMAC key";
  }

  return NotificationRequestItem;
};

const notificationHandler = async (
  notification: Types.notification.NotificationRequestItem,
  apiKey: string
) => {
  // Get order id from webhook metadata
  const orderId = await getOrderId(notification, apiKey);

  if (!orderId) {
    return;
  }

  // Get order transactions and run deduplication
  // https://docs.adyen.com/development-resources/webhooks/best-practices#handling-duplicates
  const transactions = await getOrderTransactions({ id: orderId });
  const duplicate = await isNotificationDuplicate(transactions, notification);

  if (duplicate) {
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

    const data = await getUpdatedTransactionData(transaction, notification);

    await updateTransaction(data);
  } else {
    const data = await getNewTransactionData(orderId, notification);

    if (!data) {
      return;
    }

    await createTransaction(data);
  }
};

const handler: Handler = async (req) => {
  const {
    paymentProviders: { adyen },
  } = await getPrivateSettings(envVars.apiUrl, false);

  if (!adyen.username || !adyen.password) {
    console.error("(from Adyen webhook) Missing Adyen configuration - no username or password");
    return Response.InternalServerError("Missing Adyen API config");
  }

  if (!isAdyenNotification(req.params)) {
    return Response.BadRequest();
  }

  // Get basic auth token
  const encodedCredentials = Buffer.from(adyen.username + ":" + adyen.password, "ascii").toString(
    "base64"
  );

  if (req.headers.authorization !== `Basic ${encodedCredentials}`) {
    return Response.Unauthorized();
  }

  let notificationItem: Types.notification.NotificationRequestItem;
  try {
    // https://docs.adyen.com/development-resources/webhooks/understand-notifications#notification-structure
    // notificationItem will always contain a single item for HTTP POST
    notificationItem = validateNotificationItems(req.params.notificationItems[0], adyen.hmac!);
  } catch (error) {
    console.error("Error while validating Adyen webhook", error);
    return Response.Unauthorized();
  }

  await notificationHandler(notificationItem, adyen.apiKey!);

  return Response.OK("[accepted]");
};

export default toNextHandler([handler]);
