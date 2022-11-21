import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import {
  OrderTransactionsDocument,
  OrderTransactionsQuery,
  OrderTransactionsQueryVariables,
} from "@/saleor-app-checkout/graphql";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const getOrderTransactions = async (
  saleorApiUrl: string,
  args: OrderTransactionsQueryVariables
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  // @todo handle errors
  const { data, error: _error } = await client
    .query<OrderTransactionsQuery, OrderTransactionsQueryVariables>(OrderTransactionsDocument, args)
    .toPromise();

  if (data?.order?.errors.length === 0) {
    return data.order.transactions;
  }

  return [];
};
