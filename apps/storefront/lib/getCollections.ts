import {
  CollectionsQuery,
  CollectionsQueryDocument,
  CollectionsQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "./ssr/common";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { CHANNEL_SLUG } from "./const";
import { NetworkError } from "./getSales";

export const getCollectionsData = async () => {
  try {
    const collectionsResult: ApolloQueryResult<CollectionsQuery> = await serverApolloClient.query<
      CollectionsQuery,
      CollectionsQueryVariables
    >({
      query: CollectionsQueryDocument,
      variables: { perPage: 7, channel: CHANNEL_SLUG },
    });

    return collectionsResult;
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error("ApolloError", error);
    } else if (error instanceof NetworkError) {
      console.error("NetworkError", error);
    } else {
      console.error("Error", error);
    }

    throw error;
  }
};
