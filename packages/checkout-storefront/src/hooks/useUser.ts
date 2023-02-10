import { useUserQuery } from "@/checkout-storefront/graphql";
import { useMemo } from "react";

export const useUser = () => {
  const [{ data, fetching: loading, stale }] = useUserQuery();

  const user = data?.user;

  const authenticated = useMemo(() => !!user?.id, [user?.id]);

  return { user, loading: loading || stale, authenticated };
};
