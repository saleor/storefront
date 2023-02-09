import { useUserQuery } from "@/checkout-storefront/graphql";

export const useUser = () => {
  const [{ data, fetching: loading, stale }] = useUserQuery();

  return { user: data?.user, loading: loading || stale };
};
