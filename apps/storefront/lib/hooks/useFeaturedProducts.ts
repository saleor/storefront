import { useQuery } from "@apollo/client";
import { CHANNEL_SLUG, STOREFRONT_NAME } from "../const";
import { FeaturedProductsQueryDocument } from "@/saleor/api";

export const useFeaturedProducts = () => {
  const featuredProductsBranding =
    STOREFRONT_NAME === "CLOTHES4U" ? "polecane-produkty-c4u" : "polecane-produkty";

  const { data, loading, error } = useQuery(FeaturedProductsQueryDocument, {
    variables: { slug: featuredProductsBranding, channel: CHANNEL_SLUG },
  });

  if (error) {
    console.error("Error loading featured products:", error);
    return { featuredProducts: null, loading, error };
  }

  const featuredProducts = {
    products: data?.collection?.products?.edges?.map((edge: any) => edge.node) || [],
    name: data?.collection?.name,
    backgroundImage: data?.collection?.backgroundImage,
  };

  return { featuredProducts, loading, error };
};
