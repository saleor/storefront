import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import { SalePathsDocument, SalePathsQuery, SalePathsQueryVariables } from "@/saleor/api";

import { CHANNELS, LOCALES, Path } from "../regions";
import { serverApolloClient } from "./common";

export interface SalePathArguments extends ParsedUrlQuery {
  channel?: string;
  locale?: string;
  id: string;
}

export const salePaths = async () => {
  const paths: Path<SalePathArguments>[] = [];

  for (const channel of CHANNELS) {
    const channelSlug = channel.slug;
    let hasNextPage = true;
    let endCursor = "";

    while (hasNextPage) {
      const response: ApolloQueryResult<SalePathsQuery> = await serverApolloClient.query<
        SalePathsQuery,
        SalePathsQueryVariables
      >({
        query: SalePathsDocument,
        fetchPolicy: "no-cache",
        variables: {
          channel: channelSlug,
          after: endCursor,
        },
      });

      const edges = response.data.externalSales?.edges;
      if (!edges) {
        break;
      }
      const responseIds: string[] = edges.map((edge) => edge.node.id);
      for (const locale of LOCALES) {
        responseIds.forEach((id) => {
          paths.push({
            params: {
              channel: channelSlug,
              locale: locale.slug,
              id,
            },
          });
        });
      }

      hasNextPage = response.data?.externalSales?.pageInfo.hasNextPage || false;
      endCursor = response.data.externalSales?.pageInfo.endCursor || "";
    }
  }

  return paths;
};
