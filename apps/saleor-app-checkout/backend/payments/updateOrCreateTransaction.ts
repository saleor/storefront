import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createTransaction } from "./createTransaction";
import { getOrderTransactions } from "./getOrderTransactions";
import { updateTransaction } from "./updateTransaction";

async function findTransactionInOrder({
  saleorApiHost,
  reference,
  orderId,
}: {
  saleorApiHost: string;
  reference: string | null | undefined;
  orderId: string;
}) {
  if (!reference) return null;

  try {
    const orderTransactions = await getOrderTransactions(saleorApiHost, { id: orderId });

    if (orderTransactions.length) {
      return orderTransactions.find((transaction) => transaction.reference === reference);
    }
  } catch (e) {
    console.error("Error while finding transaction in order", e);
  }
}

export async function updateOrCreateTransaction({
  saleorApiHost,
  orderId,
  transactionData,
}: {
  saleorApiHost: string;
  orderId: string;
  transactionData: TransactionCreateMutationVariables;
}) {
  const reference = transactionData.transaction.reference;
  const existingTransaction = await findTransactionInOrder({ saleorApiHost, reference, orderId });

  if (existingTransaction) {
    console.info(`Transaction ${existingTransaction.id} updated`, transactionData);
    return updateTransaction(saleorApiHost, {
      ...transactionData,
      id: existingTransaction.id,
    });
  }

  console.info("Transaction created", transactionData);
  return createTransaction(saleorApiHost, {
    ...transactionData,
  });
}
