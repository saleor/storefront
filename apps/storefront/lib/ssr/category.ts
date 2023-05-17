import { ApolloQueryResult } from "@apollo/client";
import { ParsedUrlQuery } from "querystring";

import {
  CategoryPathsDocument,
  CategoryPathsQuery,
  CategoryPathsQueryVariables,
} from "@/saleor/api";

import { API_URI } from "@/lib/const";
import { createServerSideApolloClient } from "@saleor/auth-sdk/react/apollo";
import { CHANNELS, LOCALES, Path } from "../regions";

export interface CategoryPathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const categoryPaths = async () => {
  const serverApolloClient = createServerSideApolloClient(API_URI);
  const paths: Path<CategoryPathArguments>[] = [];

  let hasNextPage = true;
  let endCursor = "";

  while (hasNextPage) {
    const response: ApolloQueryResult<CategoryPathsQuery> = await serverApolloClient.query<
      CategoryPathsQuery,
      CategoryPathsQueryVariables
    >({
      query: CategoryPathsDocument,
      fetchPolicy: "no-cache",
      variables: {
        after: endCursor,
      },
    });

    const edges = response.data.categories?.edges;
    if (!edges) {
      break;
    }
    const responseSlugs: string[] = edges.map((edge) => edge.node.slug);
    for (const channel of CHANNELS) {
      const channelSlug = channel.slug;
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
    }
    hasNextPage = response.data?.categories?.pageInfo.hasNextPage || false;
    endCursor = response.data.categories?.pageInfo.endCursor || "";
  }

  return paths;
};
