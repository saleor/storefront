import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import {
  OrderFragment,
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionFragment,
  TransactionStatus,
  TransactionUpdateInput,
} from "@/saleor-app-checkout/graphql";
import { CheckoutAPI, Client, Types } from "@adyen/api-library";
import currency from "currency.js";
import { getTransactionAmountGetterAsMoney } from "../../utils";
import { failedEvents } from "./consts";
import { getAdyenIntegerAmountFromSaleor, getSaleorAmountFromAdyenInteger } from "checkout-common";
import invariant from "ts-invariant";

const OperationsEnum = Types.notification.NotificationRequestItem.OperationsEnum;
const EventCodeEnum = Types.notification.NotificationRequestItem.EventCodeEnum;

export const mapAvailableActions = (
  operations: Types.notification.NotificationRequestItem.OperationsEnum[] | undefined
): TransactionActionEnum[] => {
  if (!operations) return [];

  return operations.map((operation) => {
    switch (operation) {
      case OperationsEnum.Capture:
        return "CHARGE";

      case OperationsEnum.Refund:
        return "REFUND";

      case OperationsEnum.Cancel:
        return "VOID";

      default:
        throw "OperationsEnum out of bounds";
    }
  });
};

export const getAdyenClient = async (saleorApiUrl: string) => {
  const {
    paymentProviders: {
      adyen: { apiKey, merchantAccount, clientKey, ...restAdyenSettings },
    },
  } = await getPrivateSettings({ saleorApiUrl, obfuscateEncryptedData: false });

  invariant(apiKey, "API key not defined");
  invariant(merchantAccount, "Missing merchant account configuration");

  const client = new Client({
    apiKey: apiKey,
    environment: "TEST",
  });

  const checkout = new CheckoutAPI(client);

  return {
    client,
    checkout,
    config: { ...restAdyenSettings, clientKey, apiKey, merchantAccount },
  };
};

export const getLineItems = (lines: OrderFragment["lines"]): Types.checkout.LineItem[] =>
  lines.map((line) => ({
    description: line.productName + " - " + line.variantName,
    quantity: line.quantity,
    taxPercentage: line.taxRate * 100,
    taxAmount: getAdyenIntegerAmountFromSaleor(
      line.totalPrice.tax.amount,
      line.totalPrice.tax.currency
    ),
    amountExcludingTax: getAdyenIntegerAmountFromSaleor(
      line.totalPrice.net.amount,
      line.totalPrice.net.currency
    ),
    amountIncludingTax: getAdyenIntegerAmountFromSaleor(
      line.totalPrice.gross.amount,
      line.totalPrice.gross.currency
    ),
    id: line.id,
    imageUrl: line.thumbnail?.url,
    itemCategory: line.variant?.product.category?.name,
  }));

export const createEventUniqueKey = (event: TransactionEventFragment) =>
  [event.name, event.reference].join();

export const encodeBasicAuth = (username: string, password: string) => {
  return Buffer.from(username + ":" + password, "ascii").toString("base64");
};

export const verifyBasicAuth = (username: string, password: string, token: string) => {
  const credentials = encodeBasicAuth(username, password);
  return token === `Basic ${credentials}`;
};

export const getNotificationStatus = (
  notification: Types.notification.NotificationRequestItem
): TransactionStatus => {
  const { eventCode, success } = notification;
  if (
    failedEvents.has(eventCode) ||
    success === Types.notification.NotificationRequestItem.SuccessEnum.False
  ) {
    return "FAILURE";
  }

  return "SUCCESS";
};

export type TransactionAmounts = Pick<
  TransactionUpdateInput,
  "amountRefunded" | "amountAuthorized" | "amountCharged" | "amountVoided"
>;

export const nonNegative = (amount: number) => (amount <= 0 ? 0 : amount);

const getCurrencyFromTransaction = (transaction: TransactionFragment | null) => {
  if (!transaction) {
    return undefined;
  }

  const currencies = [
    transaction?.refundedAmount?.currency,
    transaction?.voidedAmount?.currency,
    transaction?.chargedAmount?.currency,
    transaction?.authorizedAmount?.currency,
  ];

  // find first existing currency
  return currencies.find((item) => typeof item === "string");
};

export const isNotificationAmountValid = (
  notification: Partial<Pick<Types.notification.NotificationRequestItem, "amount">>
): notification is { amount: { value: number; currency: string } } => {
  if (
    typeof notification?.amount?.currency !== "string" ||
    typeof notification?.amount?.value !== "number"
  ) {
    return false;
  }

  return true;
};

export const isNotificationCurrencyMatchingTransaction = (
  notificationCurrency: string,
  transaction: TransactionFragment | null
) => {
  const transactionCurrency = getCurrencyFromTransaction(transaction);
  if (!transactionCurrency) {
    // Transaction is not created or doesn't have amounts set yet
    return true;
  }

  return notificationCurrency === transactionCurrency;
};

export const getTransactionAmountFromAdyen = (
  notification: Types.notification.NotificationRequestItem,
  transaction: TransactionFragment | null
): TransactionAmounts => {
  const getTransactionAmount = getTransactionAmountGetterAsMoney({
    voided: transaction?.voidedAmount?.amount,
    charged: transaction?.chargedAmount?.amount,
    refunded: transaction?.refundedAmount?.amount,
    authorized: transaction?.authorizedAmount?.amount,
  });

  if (notification.success === Types.notification.NotificationRequestItem.SuccessEnum.False) {
    return {};
  }

  if (!isNotificationAmountValid(notification)) {
    console.error("(Adyen webhook) Notification without amount or currency");
    throw new Error("Notification doesn't contain amount or currency");
  }

  const notificationAmount = currency(
    getSaleorAmountFromAdyenInteger(notification.amount.value, notification.amount.currency)
  );

  if (!isNotificationCurrencyMatchingTransaction(notification.amount.currency, transaction)) {
    console.error("(Adyen webhook) Mistmatch between notification and transaction currency");
    throw new Error("Mismatch between notification and transaction currency");
  }

  switch (notification.eventCode) {
    case EventCodeEnum.Pending:
      return {};

    case EventCodeEnum.Authorisation:
    case EventCodeEnum.AuthorisationAdjustment:
      return {
        amountAuthorized: {
          amount: notificationAmount.value,
          currency: notification.amount.currency,
        },
      };

    case EventCodeEnum.Capture:
      return {
        amountAuthorized: {
          // Payment can be partially captured
          amount: nonNegative(
            getTransactionAmount("authorized").subtract(notificationAmount).value
          ),
          currency: notification.amount.currency,
        },
        amountCharged: {
          amount: notificationAmount.value,
          currency: notification.amount.currency,
        },
      };

    case EventCodeEnum.Cancellation:
      const authorizedAmount = getTransactionAmount("authorized").value;
      return {
        amountAuthorized: {
          amount: 0,
          currency: notification.amount.currency,
        },
        amountVoided: {
          amount: authorizedAmount > 0 ? authorizedAmount : notificationAmount,
          currency: notification.amount.currency,
        },
      };

    // Capture -> Authorized
    case EventCodeEnum.CaptureFailed:
      // This event is send after EventCodeEnum.Authorized, we need to reverse it back to Authorized state
      // https://docs.adyen.com/online-payments/capture/failure-reasons
      return {
        amountAuthorized: {
          amount: getTransactionAmount("authorized").add(notificationAmount).value,
          currency: notification.amount.currency,
        },
        amountCharged: {
          amount: 0,
          currency: notification.amount.currency,
        },
      };

    // Charged -> Refund / Chargeback
    case EventCodeEnum.Refund:
    case EventCodeEnum.RefundWithData:
    case EventCodeEnum.Chargeback:
    // Chargeback is a refund issued by 3rd party
    case EventCodeEnum.SecondChargeback:
      // 2nd Chargeback is issued after it was reversed (ChargebackReversed)
      return {
        amountRefunded: {
          amount: getTransactionAmount("refunded").add(notificationAmount).value,
          currency: notification.amount.currency,
        },
        amountCharged: {
          amount: nonNegative(getTransactionAmount("charged").subtract(notificationAmount).value),
          currency: notification.amount.currency,
        },
      };

    // Refund / Chargeback -> Charged
    case EventCodeEnum.RefundedReversed:
    case EventCodeEnum.ChargebackReversed:
    case EventCodeEnum.VoidPendingRefund:
    case EventCodeEnum.RefundFailed:
      // This event is send after EventCodeEnum.Refund, we need to reverse it back to Charged state
      // https://docs.adyen.com/online-payments/capture/failure-reasons
      return {
        amountRefunded: {
          amount: nonNegative(getTransactionAmount("refunded").subtract(notificationAmount).value),
          currency: notification.amount.currency,
        },
        amountCharged: {
          amount: getTransactionAmount("charged").add(notificationAmount).value,
          currency: notification.amount.currency,
        },
      };

    case EventCodeEnum.CancelOrRefund:
      const additionalData = notification?.additionalData as Types.notification.AdditionalData & {
        ["modification.action"]: "refund" | "cancel";
      };
      const isCanceled = additionalData?.["modification.action"] !== "refund";

      if (isCanceled) {
        const authorizedAmount = getTransactionAmount("authorized").value;
        return {
          amountAuthorized: {
            amount: 0,
            currency: notification.amount.currency,
          },
          amountVoided: {
            amount: authorizedAmount > 0 ? authorizedAmount : notificationAmount.value,
            currency: notification.amount.currency,
          },
        };
      } else {
        // isRefund
        return {
          amountCharged: {
            amount: nonNegative(getTransactionAmount("charged").subtract(notificationAmount).value),
            currency: notification.amount.currency,
          },
          amountRefunded: {
            amount: notificationAmount.value,
            currency: notification.amount.currency,
          },
        };
      }
    default:
      return {};
  }
};
