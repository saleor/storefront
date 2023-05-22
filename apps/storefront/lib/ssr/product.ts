import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import { ProductPathsDocument, ProductPathsQuery, ProductPathsQueryVariables } from "@/saleor/api";

import { CHANNELS, LOCALES, Path } from "../regions";
import { serverApolloClient } from "./common";

export interface ProductPathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const productPaths = async () => {
  const paths: Path<ProductPathArguments>[] = [];

  for (const channel of CHANNELS) {
    const channelSlug = channel.slug;
    let hasNextPage = true;
    let endCursor = "";

    while (hasNextPage) {
      const response: ApolloQueryResult<ProductPathsQuery> = await serverApolloClient.query<
        ProductPathsQuery,
        ProductPathsQueryVariables
      >({
        query: ProductPathsDocument,
        fetchPolicy: "no-cache",
        variables: {
          channel: channelSlug,
          after: endCursor,
        },
      });

      const edges = response.data.products?.edges;
      if (!edges) {
        break;
      }
      const responseSlugs: string[] = edges.map((edge) => edge.node.slug);

      for (const locale of LOCALES) {
        responseSlugs.forEach((slug) => {
          paths.push({
            params: {
              channel: channelSlug,
              locale: locale.slug,
              slug,
            },
          });
        });
      }

      hasNextPage = response.data?.products?.pageInfo.hasNextPage || false;
      endCursor = response.data.products?.pageInfo.endCursor || "";
    }
  }

  return paths;
};
