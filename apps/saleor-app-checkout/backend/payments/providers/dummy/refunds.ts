import { TransactionActionPayloadFragment } from "@/saleor-app-checkout/graphql";
import { TransactionReversal } from "@/saleor-app-checkout/types/refunds";
import { updateTransaction } from "../../updateTransaction";
import { getActionsAfterRefund, getTransactionAmountGetter } from "../../utils";

export const DUMMY_PAYMENT_TYPE = "dummy-payment";

export const handleDummyRefund = async (
  refund: TransactionReversal,
  transaction: TransactionActionPayloadFragment["transaction"]
) => {
  if (!transaction?.id) {
    throw new Error("Transaction id was not provided");
  }

  const { amount, currency } = refund;

  const transactionActions = getActionsAfterRefund(transaction, amount);
  const getAmount = getTransactionAmountGetter({
    charged: transaction.chargedAmount.amount,
    refunded: amount,
    authorized: 0,
    voided: 0,
  });

  // Create "pending" event
  await updateTransaction({
    id: transaction.id,
    transaction: {
      availableActions: transactionActions,
    },
    transactionEvent: {
      status: "PENDING",
      name: "Refund requested",
    },
  });

  // Create "completed" event + update transaction amounts
  await updateTransaction({
    id: transaction.id,
    transaction: {
      availableActions: transactionActions,
      amountRefunded: {
        amount: getAmount("refunded"),
        currency,
      },
      amountCharged: {
        amount: getAmount("charged"),
        currency,
      },
    },
    transactionEvent: {
      status: "SUCCESS",
      name: "Refund completed",
    },
  });
};
