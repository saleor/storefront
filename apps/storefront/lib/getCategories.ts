import { CategoriesQuery, CategoriesQueryDocument, CategoriesQueryVariables } from "@/saleor/api";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { serverApolloClient } from "./ssr/common";
import { NetworkError } from "./getSales";

export const getCategoriesData = async () => {
  try {
    const categoriesResult: ApolloQueryResult<CategoriesQuery> = await serverApolloClient.query<
      CategoriesQuery,
      CategoriesQueryVariables
    >({
      query: CategoriesQueryDocument,
      variables: { perPage: 100 },
    });

    return categoriesResult;
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
