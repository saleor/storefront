import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import {
  CollectionPathsDocument,
  CollectionPathsQuery,
  CollectionPathsQueryVariables,
} from "@/saleor/api";

import { CHANNELS, LOCALES, Path } from "../regions";
import { serverApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";

export interface CollectionPathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const collectionPaths = async () => {
  const paths: Path<CollectionPathArguments>[] = [];

  for (const channel of CHANNELS) {
    const channelSlug = channel.slug;
    let hasNextPage = true;
    let endCursor = "";

    while (hasNextPage) {
      const response: ApolloQueryResult<CollectionPathsQuery> = await serverApolloClient.query<
        CollectionPathsQuery,
        CollectionPathsQueryVariables
      >({
        query: CollectionPathsDocument,
        fetchPolicy: "no-cache",
        variables: {
          channel: channelSlug,
          after: endCursor,
        },
      });

      const edges = response.data.collections?.edges;
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

      hasNextPage = response.data?.collections?.pageInfo.hasNextPage || false;
      endCursor = response.data.collections?.pageInfo.endCursor || "";
    }
  }

  return paths;
};
