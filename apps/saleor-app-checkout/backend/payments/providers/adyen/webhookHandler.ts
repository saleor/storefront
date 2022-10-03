import { Types } from "@adyen/api-library";

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
  const { eventCode, pspReference, paymentMethod, operations } = notification;

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
