// https://docs.adyen.com/development-resources/webhooks

import { NextApiRequest, NextApiResponse } from "next";
import { hmacValidator, Types } from "@adyen/api-library";

import { createTransaction } from "@/backend/payments/createTransaction";
import { verifyPayment } from "@/backend/payments/providers/adyen";

const HMAC = process.env.ADYEN_HMAC!;

const validator = new hmacValidator();

const validateNotificationItems = (
  notificationItems: Types.notification.NotificationItem[]
) =>
  notificationItems.map(
    ({ NotificationRequestItem }: Types.notification.NotificationItem) => {
      // first validate the origin
      const valid = validator.validateHMAC(NotificationRequestItem, HMAC);

      if (!valid) {
        throw "Invalid HMAC key";
      }

      return NotificationRequestItem;
    }
  );

const notificationHandler = async (
  notification: Types.notification.NotificationRequestItem
) => {
  const data = await verifyPayment(notification);

  if (!data) {
    return;
  }

  createTransaction(data);
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

  let items;
  try {
    items = validateNotificationItems(req.body.notificationItems);
  } catch (error) {
    return res.status(401).send(error);
  }

  res.status(200).send("[accepted]");

  items.forEach(notificationHandler);
}
