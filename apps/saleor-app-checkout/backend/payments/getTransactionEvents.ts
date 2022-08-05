import {
  TransactionEventsDocument,
  TransactionEventsQuery,
  TransactionEventsQueryVariables,
} from "@/saleor-app-checkout/graphql";
import { getClient } from "../client";

export const getTransactionEvents = async (args: TransactionEventsQueryVariables) => {
  const { data, error } = await getClient()
    .query<TransactionEventsQuery, TransactionEventsQueryVariables>(TransactionEventsDocument, args)
    .toPromise();

  if (error) {
    console.error(error);
    return [];
  }

  return data?.transaction?.events ?? [];
};
