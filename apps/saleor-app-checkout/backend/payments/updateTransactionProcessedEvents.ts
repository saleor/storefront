import { getAuthData } from "@/saleor-app-checkout/config/saleorApp";
import {
  TransactionUpdateProcessedEventsDocument,
  TransactionUpdateProcessedEventsMutation,
  TransactionUpdateProcessedEventsMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { getClient } from "../client";

export const updateTransactionProcessedEvents = async (
  args: TransactionUpdateProcessedEventsMutationVariables
) => {
  const authData = await getAuthData()
  const client = await getClient({appToken: authData.token, apiUrl: authData.apiUrl})
  const { data, error } = await client
    .mutation<
      TransactionUpdateProcessedEventsMutation,
      TransactionUpdateProcessedEventsMutationVariables
    >(TransactionUpdateProcessedEventsDocument, args)
    .toPromise();

  const queryErrors = data?.updateMetadata?.errors ?? [];

  if (!error && queryErrors.length === 0) {
    return true;
  }

  console.error("Error while saving event as processed", error ?? queryErrors);
  return false;
};
