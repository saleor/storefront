import { getClient } from "@/checkout-app/backend/client";
import {
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/checkout-app/graphql";

export const updateTransaction = async (
  args: TransactionUpdateMutationVariables
) => {
  const { data, error } = await getClient()
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
