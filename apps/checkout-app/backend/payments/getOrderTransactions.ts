import { getClient } from "@/backend/client";
import { envVars, serverEnvVars } from "@/constants";
import {
  OrderTransactionsDocument,
  OrderTransactionsQuery,
  OrderTransactionsQueryVariables,
} from "@/graphql";

export const getOrderTransactions = async (
  args: OrderTransactionsQueryVariables
) => {
  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .query<OrderTransactionsQuery, OrderTransactionsQueryVariables>(
      OrderTransactionsDocument,
      args
    )
    .toPromise();

  console.log(data?.order?.errors, error);

  if (data?.order?.errors.length === 0) {
    return data.order.transactions;
  }

  return [];
};
