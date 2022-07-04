import { getClient } from "@/checkout-app/backend/client";
import {
  TransactionCreateDocument,
  TransactionCreateMutation,
  TransactionCreateMutationVariables,
} from "@/checkout-app/graphql";

export const createTransaction = async (
  args: TransactionCreateMutationVariables
) => {
  const { data, error } = await getClient()
    .mutation<TransactionCreateMutation, TransactionCreateMutationVariables>(
      TransactionCreateDocument,
      args
    )
    .toPromise();

  console.log(data?.transactionCreate?.errors, error);

  if (
    data?.transactionCreate?.transaction?.id &&
    data.transactionCreate.errors.length === 0
  ) {
    return true;
  }

  return false;
};
