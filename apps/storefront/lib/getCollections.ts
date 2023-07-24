import {
  CollectionsQuery,
  CollectionsQueryDocument,
  CollectionsQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "./ssr/common";
import { ApolloQueryResult } from "@apollo/client";
import { CHANNEL_SLUG } from "./const";

export const getCollectionsData = async () => {
  const collectionsResult: ApolloQueryResult<CollectionsQuery> = await serverApolloClient.query<
    CollectionsQuery,
    CollectionsQueryVariables
  >({
    query: CollectionsQueryDocument,
    variables: { perPage: 5, channel: CHANNEL_SLUG },
  });

  return collectionsResult;
};
