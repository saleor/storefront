import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import { PagePathsDocument, PagePathsQuery, PagePathsQueryVariables } from "@/saleor/api";

import { CHANNELS, LOCALES, Path } from "../regions";
import { serverApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";

export interface PagePathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const pagePaths = async () => {
  const paths: Path<PagePathArguments>[] = [];

  let hasNextPage = true;
  let endCursor = "";

  while (hasNextPage) {
    const response: ApolloQueryResult<PagePathsQuery> = await serverApolloClient.query<
      PagePathsQuery,
      PagePathsQueryVariables
    >({
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
    for (const locale of LOCALES) {
      for (const channel of CHANNELS) {
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
