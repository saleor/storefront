import { TransactionCreateMutationVariables } from "@/saleor-app-checkout/graphql";
import { createDebug } from "@/saleor-app-checkout/utils/debug";
import { createTransaction } from "./createTransaction";
import { getOrderTransactions } from "./getOrderTransactions";
import { updateTransaction } from "./updateTransaction";

const debug = createDebug("updateOrCreateTransaction")

async function findTransactionInOrder(reference: string | null | undefined, orderId: string, domain: string) {
  if (!reference) return null;

  try {
    const orderTransactions = await getOrderTransactions({ id: orderId }, domain);

    if (orderTransactions.length) {
      return orderTransactions.find((transaction) => transaction.reference === reference);
    }
  } catch (e) {
    console.error("Error while finding transaction in order", e);
  }
}

export async function updateOrCreateTransaction(
  orderId: string,
  transactionData: TransactionCreateMutationVariables,
  domain: string
) {
  const reference = transactionData.transaction.reference;
  const existingTransaction = await findTransactionInOrder(reference, orderId, domain);

  if (existingTransaction) {
    debug(`Transaction ${existingTransaction.id} updated with data: %O`, transactionData);
    return updateTransaction({
      ...transactionData,
      id: existingTransaction.id,
    }, domain);
  }

  debug("Transaction created: %O", transactionData);
  return createTransaction({
    ...transactionData,
  }, domain);
}
