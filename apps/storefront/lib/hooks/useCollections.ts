import { CollectionsQueryDocument } from "@/saleor/api";
import { CHANNEL_SLUG } from "../const";
import { useQuery } from "@apollo/client";

export const useCollections = () => {
  const { data, loading, error } = useQuery(CollectionsQueryDocument, {
    variables: { perPage: 5, channel: CHANNEL_SLUG },
  });

  if (error) {
    console.error("Error loading collections:", error);
    return { collections: null, loading, error };
  }

  return { collections: data?.collections, loading, error };
};
