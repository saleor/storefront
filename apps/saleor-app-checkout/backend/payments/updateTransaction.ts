import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/saleor-app-checkout/graphql";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const updateTransaction = async (
  saleorApiUrl: string,
  args: TransactionUpdateMutationVariables
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  // @todo handle errors
  const { data, error: _error } = await client
    .mutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(
      TransactionUpdateDocument,
      args
    )
    .toPromise();

  if (data?.transactionUpdate?.transaction?.id && data.transactionUpdate.errors.length === 0) {
    return true;
  }

  return false;
};
