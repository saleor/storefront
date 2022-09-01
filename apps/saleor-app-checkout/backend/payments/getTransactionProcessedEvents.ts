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
  const { data, error } = await getClient()
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
