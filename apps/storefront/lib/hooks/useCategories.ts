import { CategoriesQueryDocument } from "@/saleor/api";
import { useQuery } from "@apollo/client";

export const useCategories = () => {
  const { data, loading, error } = useQuery(CategoriesQueryDocument, {
    variables: { perPage: 100 },
  });

  if (error) {
    console.error("Error loading collections:", error);
    return { categories: null, loading, error };
  }

  return { categories: data?.categories, loading, error };
};
