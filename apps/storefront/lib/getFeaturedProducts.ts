import {
  FeaturedProductsQuery,
  FeaturedProductsQueryDocument,
  FeaturedProductsQueryVariables,
} from "@/saleor/api";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { CHANNEL_SLUG } from "./const";
import { serverApolloClient } from "./ssr/common";

class EntityNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "EntityNotFoundError";
  }
}

class NetworkError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export const getFeaturedProducts = async () => {
  const featuredProductsBranding =
    process.env.STOREFRONT_NAME === "CLOTHES4U" ? "polecane-produkty-c4u" : "polecane-produkty";

  try {
    const featuredProductsResult: ApolloQueryResult<FeaturedProductsQuery> =
      await serverApolloClient.query<FeaturedProductsQuery, FeaturedProductsQueryVariables>({
        query: FeaturedProductsQueryDocument,
        variables: { slug: featuredProductsBranding, channel: CHANNEL_SLUG },
      });

    if (!featuredProductsResult.data || !featuredProductsResult.data.collection) {
      throw new EntityNotFoundError("Collection not found.");
    }

    const featuredProductsData = {
      products:
        featuredProductsResult.data?.collection?.products?.edges?.map((edge: any) => edge.node) ||
        [],
      name: featuredProductsResult.data?.collection?.name || null,
      backgroundImage: featuredProductsResult.data?.collection?.backgroundImage || null,
    };

    return featuredProductsData;
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error("ApolloError", error);
    } else if (error instanceof NetworkError) {
      console.error("NetworkError", error);
    } else if (error instanceof EntityNotFoundError) {
      console.error(error.name, error.message);
      return {
        products: [],
        name: null,
        backgroundImage: null,
      };
    } else {
      console.error("Error", error);
    }

    throw error;
  }
};
