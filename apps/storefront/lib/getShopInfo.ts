import {
  ShopInformationQuery,
  ShopInformationQueryDocument,
  ShopInformationQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "./ssr/common";
import { ApolloQueryResult } from "@apollo/client";

export const getShopInfoData = async () => {
  const shopInfoResult: ApolloQueryResult<ShopInformationQuery> = await serverApolloClient.query<
    ShopInformationQuery,
    ShopInformationQueryVariables
  >({
    query: ShopInformationQueryDocument,
  });

  return shopInfoResult;
};
