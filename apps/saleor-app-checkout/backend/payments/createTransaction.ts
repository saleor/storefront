import { createDebug } from "./../../utils/debug";
import { getClient } from "@/saleor-app-checkout/backend/client";
import { apl } from "@/saleor-app-checkout/config/saleorApp";
import {
  TransactionCreateDocument,
  TransactionCreateMutation,
  TransactionCreateMutationVariables,
} from "@/saleor-app-checkout/graphql";

const debug = createDebug("createTransaction");

export const createTransaction = async (
  args: TransactionCreateMutationVariables,
  domain: string
) => {
  debug(`Creating transaction for ${args.id}`);
  const authData = await apl.get(domain);
  if (!authData) {
    throw new Error("No auth data");
  }
  const client = getClient({
    appToken: authData.token,
    apiUrl: `https://${authData.domain}/graphql/`,
  });
  const { data, error } = await client
    .mutation<TransactionCreateMutation, TransactionCreateMutationVariables>(
      TransactionCreateDocument,
      args
    )
    .toPromise();

  if (data?.transactionCreate?.transaction?.id && data.transactionCreate.errors.length === 0) {
    debug("Transaction created");
    return true;
  }

  debug("Error during creating a transaction: %O", data?.transactionCreate?.errors);
  return false;
};
