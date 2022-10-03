import { createDebug } from './../../utils/debug';
import { getClient } from "@/saleor-app-checkout/backend/client";
import { apl, getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  OrderTransactionsDocument,
  OrderTransactionsQuery,
  OrderTransactionsQueryVariables,
} from "@/saleor-app-checkout/graphql";

const debug = createDebug("getOrderTransactions")

export const getOrderTransactions = async (args: OrderTransactionsQueryVariables, domain: string) => {
  // @todo handle errors
  debug(`Get transactions for order: ${args.id}`)
  const authData = await apl.get(domain)
  if(!authData){
    throw new Error("No auth data")
  }
  const client = await getClient({appToken: authData.token, apiUrl: `https://${authData.domain}/graphql/`})
  const { data, error: _error } = await client
    .query<OrderTransactionsQuery, OrderTransactionsQueryVariables>(OrderTransactionsDocument, args)
    .toPromise();

  if (data?.order?.errors.length === 0) {
    debug(`Return existing transactions`)
    return data.order.transactions;
  }

  debug("Request returned with errors: %O", data?.order?.errors)
  return [];
};
