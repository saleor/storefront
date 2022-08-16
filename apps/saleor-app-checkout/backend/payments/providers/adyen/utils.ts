import {
  MoneyFragment,
  OrderFragment,
  TransactionActionEnum,
  TransactionEventFragment,
} from "@/saleor-app-checkout/graphql";
import { Types } from "@adyen/api-library";
import { getIntegerAmountFromSaleor } from "../../utils";

export const mapAvailableActions = (
  operations: Types.notification.NotificationRequestItem.OperationsEnum[]
): TransactionActionEnum[] =>
  operations.map((operation) => {
    if (operation === Types.notification.NotificationRequestItem.OperationsEnum.Capture) {
      return "CHARGE";
    }

    if (operation === Types.notification.NotificationRequestItem.OperationsEnum.Refund) {
      return "REFUND";
    }

    if (operation === Types.notification.NotificationRequestItem.OperationsEnum.Cancel) {
      return "VOID";
    }

    throw "OperationsEnum out of bounds";
  });

export const getLineItems = (lines: OrderFragment["lines"]): Types.checkout.LineItem[] =>
  lines.map((line) => ({
    description: line.productName + " - " + line.variantName,
    quantity: line.quantity,
    taxPercentage: line.taxRate * 100,
    taxAmount: getIntegerAmountFromSaleor(line.totalPrice.tax.amount),
    amountExcludingTax: getIntegerAmountFromSaleor(line.totalPrice.tax.amount),
    amountIncludingTax: getIntegerAmountFromSaleor(line.totalPrice.gross.amount),
    id: line.id,
    imageUrl: line.thumbnail?.url,
    itemCategory: line.variant?.product.category?.name,
  }));

export const createEventUniqueKey = (event: TransactionEventFragment) =>
  [event.name, event.reference].join();

export const getAmountAfterRefund = (money: MoneyFragment, refundAmount: number) => {
  const chargedAmount = money.amount - refundAmount;

  if (chargedAmount < 0) {
    throw "Amount after refund cannot be negative";
  }

  return chargedAmount;
};
