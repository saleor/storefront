import { NewsIdQueryDocument, NewsQueryDocument } from "@/saleor/api";
import { useQuery } from "@apollo/client";
import { CHANNEL_SLUG } from "../const";
import { useEffect } from "react";

export const useNews = () => {
  const { data: newsIdData } = useQuery(NewsIdQueryDocument);

  const newsId = newsIdData?.pageTypes?.edges[0]?.node?.id;

  const { data, loading, error } = useQuery(NewsQueryDocument, {
    variables: { id: newsId, channelSlug: CHANNEL_SLUG },
  });

  return { news: data?.pages?.edges, loading, error };
};
