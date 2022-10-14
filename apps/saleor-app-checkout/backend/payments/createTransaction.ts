import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  TransactionCreateDocument,
  TransactionCreateMutation,
  TransactionCreateMutationVariables,
} from "@/saleor-app-checkout/graphql";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const createTransaction = async (
  saleorApiHost: string,
  args: TransactionCreateMutationVariables
) => {
  const authData = await Apl.get(saleorApiHost);
  const client = getClientForAuthData(authData);
  const { data, error } = await client
    .mutation<TransactionCreateMutation, TransactionCreateMutationVariables>(
      TransactionCreateDocument,
      args
    )
    .toPromise();

  console.log(data?.transactionCreate?.errors, error);

  if (data?.transactionCreate?.transaction?.id && data.transactionCreate.errors.length === 0) {
    return true;
  }

  return false;
};
