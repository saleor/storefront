import { CategoriesQuery, CategoriesQueryDocument, CategoriesQueryVariables } from "@/saleor/api";
import { ApolloQueryResult } from "@apollo/client";
import { serverApolloClient } from "./ssr/common";

export const getCategoriesData = async () => {
  const categoriesResult: ApolloQueryResult<CategoriesQuery> = await serverApolloClient.query<
    CategoriesQuery,
    CategoriesQueryVariables
  >({
    query: CategoriesQueryDocument,
    variables: { perPage: 100 },
  });

  return categoriesResult;
};
