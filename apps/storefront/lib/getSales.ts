import {
  FeaturedProductsQuery,
  FeaturedProductsQueryDocument,
  FeaturedProductsQueryVariables,
  SalesQuery,
  SalesQueryDocument,
  SalesQueryVariables,
} from "@/saleor/api";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { CHANNEL_SLUG } from "./const";
import { serverApolloClient } from "./ssr/common";

class NetworkError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NetworkError";
  }
}

// TODO: You need one of the following permissions: MANAGE_DISCOUNTS
export const getSales = async () => {
  try {
    const salesResult: ApolloQueryResult<SalesQuery> = await serverApolloClient.query<
      SalesQuery,
      SalesQueryVariables
    >({
      query: SalesQueryDocument,
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
