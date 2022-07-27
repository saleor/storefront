import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createTransaction } from "./createTransaction";
import { getOrderTransactions } from "./getOrderTransactions";
import { updateTransaction } from "./updateTransaction";

async function findTransactionInOrder(reference: string | null | undefined, orderId: string) {
  if (!reference) return null;

  try {
    const orderTransactions = await getOrderTransactions({ id: orderId });

    if (orderTransactions.length) {
      return orderTransactions.find((transaction) => transaction.reference === reference);
    }
  } catch (e) {
    console.error("Error while finding transaction in order", e);
  }
}

export async function updateOrCreateTransaction(
  orderId: string,
  transactionData: TransactionCreateMutationVariables
) {
  const reference = transactionData.transaction.reference;
  const existingTransaction = await findTransactionInOrder(reference, orderId);

  if (existingTransaction) {
    console.info(`Transaction ${existingTransaction.id} updated`, transactionData);
    return await updateTransaction({
      ...transactionData,
      id: existingTransaction.id,
    });
  }

  console.info("Transaction created", transactionData);
  return await createTransaction({
    ...transactionData,
  });
}
