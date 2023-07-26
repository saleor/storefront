import { useQuery } from "@apollo/client";
import { SalesQueryDocument } from "@/saleor/api";
import { CHANNEL_SLUG } from "../const";

export const useSales = () => {
  const { data, loading, error } = useQuery(SalesQueryDocument, {
    variables: { channel: CHANNEL_SLUG },
  });

  if (error) {
    console.error("Error loading sales: ", error);
    return { sales: null, loading, error };
  }

  const sales = data ? data.sales : null;

  return { sales, loading, error };
};
