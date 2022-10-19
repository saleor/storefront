import {
  TransactionProcessedEventsDocument,
  TransactionProcessedEventsQuery,
  TransactionProcessedEventsQueryVariables,
} from "@/saleor-app-checkout/graphql";
import { TransactionProcessedEvents } from "@/saleor-app-checkout/types";
import { getClientForAuthData } from "../saleorGraphqlClient";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const getTransactionProcessedEvents = async (
  saleorApiUrl: string,
  args: TransactionProcessedEventsQueryVariables
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

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
