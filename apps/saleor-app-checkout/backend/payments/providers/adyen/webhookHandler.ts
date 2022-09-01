import { Client, CheckoutAPI, Types } from "@adyen/api-library";

import {
  TransactionCreateMutationVariables,
  TransactionEventInput,
  TransactionFragment,
  TransactionUpdateInput,
  TransactionUpdateMutationVariables,
} from "@/saleor-app-checkout/graphql";

import {
  mapAvailableActions,
  createEventUniqueKey,
  getNotificationStatus,
  getTransactionAmountFromAdyen,
} from "./utils";

export const ADYEN_PAYMENT_PREFIX = "adyen";

export const isNotificationDuplicate = (
  transactions: TransactionFragment[],
  notificationItem: Types.notification.NotificationRequestItem
) => {
  const eventKeys = transactions.map(({ events }) => events.map(createEventUniqueKey)).flat();
  const newEventKey = createEventUniqueKey({
    reference: notificationItem.pspReference,
    name: notificationItem.eventCode.toString(),
  });

  return eventKeys.includes(newEventKey);
};

export const getOrderId = async (
  notification: Types.notification.NotificationRequestItem,
  apiKey: string
) => {
  const { additionalData } = notification;
  const paymentLinkId = additionalData?.paymentLinkId;

  if (!paymentLinkId) {
    return;
  }

  const client = new Client({
    apiKey,
    environment: "TEST", // TODO: Choose environment dynamically in Dashboard
  });

  const checkout = new CheckoutAPI(client);

  try {
    const { metadata } = await checkout.getPaymentLinks(paymentLinkId);

    return metadata?.orderId;
  } catch (e) {
    // INFO: checkout.getPaymentLinks method fails randomly
    // it's possible to get notification metadata directly from notification itself (undocumented)
    console.warn("checkout.getPaymentLinks failed");

    return "metadata.orderId" in additionalData ? additionalData["metadata.orderId"] : null;
  }
};

export const getUpdatedTransactionData = (
  transaction: TransactionFragment,
  notification: Types.notification.NotificationRequestItem
): TransactionUpdateMutationVariables => {
  const { eventCode, pspReference, originalReference, operations } = notification;

  if (!originalReference) {
    throw "originalReference does not exit on notification";
  }

  const updatedTransactionEvent: TransactionEventInput = {
    name: eventCode.toString(),
    status: getNotificationStatus(notification),
    reference: pspReference,
  };

  const updatedTransaction: TransactionUpdateInput = {
    status: eventCode.toString(),
    availableActions: mapAvailableActions(operations),
    ...getTransactionAmountFromAdyen(notification, transaction),
  };

  return {
    id: transaction.id,
    transaction: updatedTransaction,
    transactionEvent: updatedTransactionEvent,
  };
};

export const getNewTransactionData = (
  orderId: string,
  notification: Types.notification.NotificationRequestItem
): TransactionCreateMutationVariables | undefined => {
  const { eventCode, pspReference, paymentMethod, additionalData, operations } = notification;
  const paymentLinkId = additionalData?.paymentLinkId;

  if (!paymentLinkId) {
    throw "Payment link does not exist";
  }

  const transactionEvent: TransactionEventInput = {
    name: eventCode.toString(),
    status: getNotificationStatus(notification),
    reference: pspReference,
  };

  return {
    id: orderId,
    transactionEvent,
    transaction: {
      status: eventCode.toString(),
      type: `${ADYEN_PAYMENT_PREFIX}-${paymentMethod || "(unknown-payment-method)"}`,
      reference: pspReference,
      availableActions: mapAvailableActions(operations),
      ...getTransactionAmountFromAdyen(notification, null),
    },
  };
};
