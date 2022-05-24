import {
  MoneyFragment,
  OrderFragment,
  TransactionActionEnum,
  TransactionEventFragment,
} from "@/graphql";
import { Types } from "@adyen/api-library";

export const getAdyenAmountFromSaleor = (float: number) =>
  parseInt((float * 100).toFixed(0), 10);
export const getSaleorAmountFromAdyen = (integer: number) =>
  parseFloat((integer / 100).toFixed(2));

export const mapAvailableActions = (
  operations: Types.notification.NotificationRequestItem.OperationsEnum[]
): TransactionActionEnum[] =>
  operations.map((operation) => {
    if (
      operation ===
      Types.notification.NotificationRequestItem.OperationsEnum.Capture
    ) {
      return "CHARGE";
    }

    if (
      operation ===
      Types.notification.NotificationRequestItem.OperationsEnum.Refund
    ) {
      return "REFUND";
    }

    if (
      operation ===
      Types.notification.NotificationRequestItem.OperationsEnum.Cancel
    ) {
      return "VOID";
    }

    throw "OperationsEnum out of bounds";
  });

export const getLineItems = (
  lines: OrderFragment["lines"]
): Types.checkout.LineItem[] =>
  lines.map((line) => ({
    description: line.productName + " - " + line.variantName,
    quantity: line.quantity,
    taxPercentage: line.taxRate * 100,
    taxAmount: getAdyenAmountFromSaleor(line.totalPrice.tax.amount),
    amountExcludingTax: getAdyenAmountFromSaleor(line.totalPrice.tax.amount),
    amountIncludingTax: getAdyenAmountFromSaleor(line.totalPrice.gross.amount),
    id: line.id,
    imageUrl: line.thumbnail?.url,
    itemCategory: line.variant?.product.category?.name,
  }));

export const createEventUniqueKey = (event: TransactionEventFragment) =>
  [event.name, event.reference].join();

export const getAmountAfterRefund = (
  money: MoneyFragment,
  refundAmount: number
) => {
  const chargedAmount = money.amount - refundAmount;

  if (chargedAmount < 0) {
    throw "Amount after refund cannot be negative";
  }

  return chargedAmount;
};
