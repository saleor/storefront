import { client } from "@/backend/client";
import {
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/graphql";

export const updateTransaction = async (
  args: TransactionUpdateMutationVariables
) => {
  const { data, error } = await client
    .mutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(
      TransactionUpdateDocument,
      args
    )
    .toPromise();

  console.log(data?.transactionUpdate?.errors, error);

  if (
    data?.transactionUpdate?.transaction?.id &&
    data.transactionUpdate.errors.length === 0
  ) {
    return true;
  }

  return false;
};
