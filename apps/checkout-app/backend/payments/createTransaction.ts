import { client } from "@/backend/client";
import {
  TransactionCreateDocument,
  TransactionCreateMutation,
  TransactionCreateMutationVariables,
} from "@/graphql";

export const createTransaction = async (
  args: TransactionCreateMutationVariables
) => {
  const { data, error } = await client
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
