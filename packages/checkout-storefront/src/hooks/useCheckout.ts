import { useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useQueryVarsWithLocale } from "@/checkout-storefront/hooks/useQueryVarsWithLocale";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { authenticating } = useAuthState();
  const getQueryVarsWithLocale = useQueryVarsWithLocale();

  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: getQueryVarsWithLocale({ id }),
    pause: pause || authenticating,
  });

  return { checkout: data?.checkout as Checkout, loading: loading || stale, refetch };
};
