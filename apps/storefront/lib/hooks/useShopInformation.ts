import {
  ShopInformationQueryDocument,
  ShopInformationQuery,
  ShopInformationQueryVariables,
} from "@/saleor/api";
import { ApolloError, useQuery } from "@apollo/client";

type UseShopInformationResponse = {
  shop: ShopInformationQuery["shop"] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export const useShopInformation = (): UseShopInformationResponse => {
  const { data, error, loading } = useQuery<ShopInformationQuery, ShopInformationQueryVariables>(
    ShopInformationQueryDocument
  );

  return { shop: data?.shop, loading, error };
};
