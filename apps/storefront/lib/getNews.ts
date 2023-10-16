import {
  NewsIdQuery,
  NewsIdQueryDocument,
  NewsIdQueryVariables,
  NewsQuery,
  NewsQueryDocument,
  NewsQueryVariables,
} from "@/saleor/api";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { serverApolloClient } from "./ssr/common";
import { CHANNEL_SLUG } from "./const";
import { NetworkError } from "./getSales";

export const getNewsIdData = async () => {
  try {
    const newsIdResult: ApolloQueryResult<NewsIdQuery> = await serverApolloClient.query<
      NewsIdQuery,
      NewsIdQueryVariables
    >({
      query: NewsIdQueryDocument,
      variables: { perPage: 7 },
    });

    return newsIdResult;
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error("ApolloError", error);
    } else if (error instanceof NetworkError) {
      console.error("NetworkError", error);
    } else {
      console.error("Error", error);
    }

    throw error;
  }
};

export const getNewsData = async (newsId: string) => {
  try {
    const newsData: ApolloQueryResult<NewsQuery> = await serverApolloClient.query<
      NewsQuery,
      NewsQueryVariables
    >({
      query: NewsQueryDocument,
      variables: { id: newsId, channelSlug: CHANNEL_SLUG },
    });

    return newsData;
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error("ApolloError", error);
    } else if (error instanceof NetworkError) {
      console.error("NetworkError", error);
    } else {
      console.error("Error", error);
    }

    throw error;
  }
};
