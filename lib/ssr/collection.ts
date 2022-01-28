import { ParsedUrlQuery } from "querystring";

import {
  CollectionPathsDocument,
  CollectionPathsQuery,
  CollectionPathsQueryVariables,
} from "@/saleor/api";

import apolloClient from "../graphql";
import { CHANNELS, LOCALES, Path } from "../regions";

export interface CollectionPathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
  slug: string;
}

export const collectionPaths = async () => {
  let paths: Path<CollectionPathArguments>[] = [];

  for (let channel of CHANNELS) {
    let channelSlug = channel.slug;
    let hasNextPage = true;
    let endCursor = "";

    while (hasNextPage) {
      const response =
        await apolloClient.query<
          CollectionPathsQuery,
          CollectionPathsQueryVariables
        >(CollectionPathsDocument,
          {
            channel: channelSlug,
            after: endCursor,
          },
        ).toPromise();

      const edges = response.data?.collections?.edges;
      if (!edges) {
        break;
      }
      const responseSlugs: string[] = edges.map((edge) => edge.node.slug);
      for (let locale of LOCALES) {
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
      endCursor = response.data?.collections?.pageInfo.endCursor || "";
    }
  }

  return paths;
};
