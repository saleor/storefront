import {
  TransactionUpdateProcessedEventsDocument,
  TransactionUpdateProcessedEventsMutation,
  TransactionUpdateProcessedEventsMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { getClient } from "../client";

export const updateTransactionProcessedEvents = async (
  args: TransactionUpdateProcessedEventsMutationVariables
) => {
  const { data, error } = await getClient()
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
