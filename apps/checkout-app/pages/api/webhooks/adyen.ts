// https://docs.adyen.com/development-resources/webhooks

import { NextApiRequest, NextApiResponse } from "next";
import { hmacValidator, Types } from "@adyen/api-library";

import { createTransaction } from "@/backend/payments/createTransaction";
import {
  getNewTransactionData,
  getOrderId,
  getUpdatedTransactionData,
  isNotificationDuplicate,
} from "@/backend/payments/providers/adyen";
import { getOrderTransactions } from "@/backend/payments/getOrderTransactions";
import { updateTransaction } from "@/backend/payments/updateTransaction";

const HMAC = process.env.ADYEN_HMAC!;

const validator = new hmacValidator();

const validateNotificationItems = ({
  NotificationRequestItem,
}: Types.notification.NotificationItem) => {
  // first validate the origin
  const valid = validator.validateHMAC(NotificationRequestItem, HMAC);

  if (!valid) {
    throw "Invalid HMAC key";
  }

  return NotificationRequestItem;
};

const notificationHandler = async (
  notification: Types.notification.NotificationRequestItem
) => {
  // Get order id from webhook metadata
  const orderId = await getOrderId(notification);

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

    updateTransaction(data);
  } else {
    const data = await getNewTransactionData(orderId, notification);

    if (!data) {
      return;
    }

    createTransaction(data);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get basic auth token
  const encodedCredentials = Buffer.from(
    process.env.ADYEN_BASIC_USERNAME + ":" + process.env.ADYEN_BASIC_PASSWORD,
    "ascii"
  ).toString("base64");

  if (req.headers.authorization !== `Basic ${encodedCredentials}`) {
    return res.status(401).send("Invalid credentials");
  }

  let notificationItem: Types.notification.NotificationRequestItem;
  try {
    // https://docs.adyen.com/development-resources/webhooks/understand-notifications#notification-structure
    // notificationItem will always contain a single item for HTTP POST
    notificationItem = validateNotificationItems(req.body.notificationItems[0]);
  } catch (error) {
    return res.status(401).send(error);
  }

  res.status(200).send("[accepted]");

  notificationHandler(notificationItem);
}
