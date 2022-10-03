import { getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  TransactionProcessedEventsDocument,
  TransactionProcessedEventsQuery,
  TransactionProcessedEventsQueryVariables,
} from "@/saleor-app-checkout/graphql";
import { TransactionProcessedEvents } from "@/saleor-app-checkout/types";
import { getClient } from "../client";

export const getTransactionProcessedEvents = async (
  args: TransactionProcessedEventsQueryVariables
) => {
    const authData = await getAuthData()
  const client = await getClient({appToken: authData.token, apiUrl: authData.apiUrl})
  const { data, error } = await client
    .query<TransactionProcessedEventsQuery, TransactionProcessedEventsQueryVariables>(
      TransactionProcessedEventsDocument,
      args
    )
    .toPromise();

  if (error) {
    throw error;
  }

  return JSON.parse(data?.transaction?.processedEvents ?? "[]") as TransactionProcessedEvents;
};
