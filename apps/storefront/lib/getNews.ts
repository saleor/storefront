import {
  NewsIdQuery,
  NewsIdQueryDocument,
  NewsIdQueryVariables,
  NewsQuery,
  NewsQueryDocument,
  NewsQueryVariables,
} from "@/saleor/api";
import { ApolloQueryResult } from "@apollo/client";
import { serverApolloClient } from "./ssr/common";
import { CHANNEL_SLUG } from "./const";

export const getNewsIdData = async () => {
  const newsIdResult: ApolloQueryResult<NewsIdQuery> = await serverApolloClient.query<
    NewsIdQuery,
    NewsIdQueryVariables
  >({
    query: NewsIdQueryDocument,
  });

  return newsIdResult;
};

export const getNewsData = async (newsId: any) => {
  const newsData: ApolloQueryResult<NewsQuery> = await serverApolloClient.query<
    NewsQuery,
    NewsQueryVariables
  >({
    query: NewsQueryDocument,
    variables: { id: newsId, channelSlug: CHANNEL_SLUG },
  });

  return newsData;
};
