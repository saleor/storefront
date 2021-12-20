import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import {
  PagePathsDocument,
  PagePathsQuery,
  PagePathsQueryVariables,
} from "@/saleor/api";

import apolloClient from "../graphql";
import { CHANNELS, LOCALES, Path } from "../regions";

export interface PagePathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const pagePaths = async () => {
  let paths: Path<PagePathArguments>[] = [];

  let hasNextPage = true;
  let endCursor = "";

  while (hasNextPage) {
    const response: ApolloQueryResult<PagePathsQuery> =
      await apolloClient.query<PagePathsQuery, PagePathsQueryVariables>({
        query: PagePathsDocument,
        fetchPolicy: "no-cache",
        variables: {
          after: endCursor,
        },
      });

    const edges = response.data.pages?.edges;
    if (!edges) {
      break;
    }
    const responseSlugs: string[] = edges.map((edge) => edge.node.slug);
    for (let locale of LOCALES) {
      for (let channel of CHANNELS) {
        responseSlugs.forEach((slug) => {
          paths.push({
            params: {
              channel: channel.slug,
              locale: locale.slug,
              slug,
            },
          });
        });
      }
    }

    hasNextPage = response.data?.pages?.pageInfo.hasNextPage || false;
    endCursor = response.data.pages?.pageInfo.endCursor || "";
  }

  return paths;
};
