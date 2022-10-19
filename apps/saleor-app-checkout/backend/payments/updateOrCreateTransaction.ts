import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createTransaction } from "./createTransaction";
import { getOrderTransactions } from "./getOrderTransactions";
import { updateTransaction } from "./updateTransaction";

async function findTransactionInOrder({
  saleorApiUrl,
  reference,
  orderId,
}: {
  saleorApiUrl: string;
  reference: string | null | undefined;
  orderId: string;
}) {
  if (!reference) return null;

  try {
    const orderTransactions = await getOrderTransactions(saleorApiUrl, { id: orderId });

    if (orderTransactions.length) {
      return orderTransactions.find((transaction) => transaction.reference === reference);
    }
  } catch (e) {
    console.error("Error while finding transaction in order", e);
  }
}

export async function updateOrCreateTransaction({
  saleorApiUrl,
  orderId,
  transactionData,
}: {
  saleorApiUrl: string;
  orderId: string;
  transactionData: TransactionCreateMutationVariables;
}) {
  const reference = transactionData.transaction.reference;
  const existingTransaction = await findTransactionInOrder({ saleorApiUrl, reference, orderId });

  if (existingTransaction) {
    console.info(`Transaction ${existingTransaction.id} updated`, transactionData);
    return updateTransaction(saleorApiUrl, {
      ...transactionData,
      id: existingTransaction.id,
    });
  }

  console.info("Transaction created", transactionData);
  return createTransaction(saleorApiUrl, {
    ...transactionData,
  });
}
