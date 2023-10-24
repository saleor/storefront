import { SalesQuery, SalesQueryDocument, SalesQueryVariables } from "@/saleor/api";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { serverApolloClient } from "./ssr/common";
import { CHANNEL_SLUG } from "./const";

export class NetworkError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export const getSales = async () => {
  try {
    const salesResult: ApolloQueryResult<SalesQuery> = await serverApolloClient.query<
      SalesQuery,
      SalesQueryVariables
    >({
      query: SalesQueryDocument,
      variables: {
        channel: CHANNEL_SLUG,
      },
    });

    return salesResult;
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
