import {
  TransactionUpdateProcessedEventsDocument,
  TransactionUpdateProcessedEventsMutation,
  TransactionUpdateProcessedEventsMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { getClientForAuthData } from "../saleorGraphqlClient";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const updateTransactionProcessedEvents = async (
  saleorApiUrl: string,
  args: TransactionUpdateProcessedEventsMutationVariables
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

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
