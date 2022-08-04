import {
  TransactionActionEnum,
  TransactionActionPayloadFragment,
} from "@/saleor-app-checkout/graphql";
import currency from "currency.js";

export const formatRedirectUrl = (redirectUrl: string, orderId: string) => {
  const url = new URL(redirectUrl);
  url.searchParams.set("order", orderId);

  return url.toString();
};

type Money = string | number | undefined;

type Amounts = {
  charged: Money;
  authorized: Money;
  refunded: Money;
  voided: Money;
};

const notNegative = (number: number) => (number < 0 ? 0 : number);

export const getTransactionAmountGetter = (amounts: Amounts) => {
  const charged = amounts?.charged ?? 0;
  const authorized = amounts?.authorized ?? 0;
  const refunded = amounts?.refunded ?? 0;
  const voided = amounts?.voided ?? 0;

  return (type: keyof Amounts): number => {
    switch (type) {
      case "refunded":
        return currency(refunded).value;
      case "voided":
        return currency(voided).value;
      case "charged":
        return notNegative(currency(charged).subtract(refunded).subtract(voided).value);
      case "authorized":
        return notNegative(
          currency(authorized).subtract(charged).subtract(refunded).subtract(voided).value
        );
    }
  };
};

export const getTransactionAmountGetterAsMoney = (amounts: Amounts) => (type: keyof Amounts) =>
  currency(getTransactionAmountGetter(amounts)(type));

export const getActionsAfterRefund = (
  transaction: TransactionActionPayloadFragment["transaction"],
  refundAmount: number
) => {
  const getTransactionAmount = getTransactionAmountGetter({
    voided: transaction?.voidedAmount.amount,
    charged: transaction?.chargedAmount.amount,
    refunded: transaction?.refundedAmount.amount,
    authorized: transaction?.authorizedAmount.amount,
  });

  const transactionActions: TransactionActionEnum[] = [];

  if (getTransactionAmount("charged") < Number(refundAmount)) {
    // Some money in transaction was not refunded
    transactionActions.push("REFUND");
  }

  if (Number(refundAmount) > getTransactionAmount("charged")) {
    // Refunded more than charged
    throw new Error("Cannot refund more than charged in transaction");
  }

  return transactionActions;
};
