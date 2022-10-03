import { createDebug } from './../../utils/debug';
import { getClient } from "@/saleor-app-checkout/backend/client";
import { apl, getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  TransactionUpdateDocument,
  TransactionUpdateMutation,
  TransactionUpdateMutationVariables,
} from "@/saleor-app-checkout/graphql";

const debug = createDebug("updateTransaction")

export const updateTransaction = async (args: TransactionUpdateMutationVariables, domain: string) => {
  // @todo handle errors
    const authData = await apl.get(domain)
    if(!authData){
      throw new Error("No auth data")
    }
  const client = await getClient({appToken: authData.token, apiUrl: `https://${authData.domain}/graphql/`})
  const { data, error: _error } = await client
    .mutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(
      TransactionUpdateDocument,
      args
    )
    .toPromise();

  if (data?.transactionUpdate?.transaction?.id && data.transactionUpdate.errors.length === 0) {
    debug("Transaction updated")
    return true;
  }
  debug("Could not update the transaction: %O", data?.transactionUpdate?.errors)
  return false;
};
