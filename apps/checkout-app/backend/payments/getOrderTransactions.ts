import { getClient } from "@/checkout-app/backend/client";
import { envVars, serverEnvVars } from "@/checkout-app/constants";
import {
  OrderTransactionsDocument,
  OrderTransactionsQuery,
  OrderTransactionsQueryVariables,
} from "@/checkout-app/graphql";

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
