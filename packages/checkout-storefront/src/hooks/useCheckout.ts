import { useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { authenticating } = useAuthState();

  const [{ data, fetching: loading }, refetch] = useCheckoutQuery({
    variables: { id },
    pause: pause || authenticating,
  });

  return { checkout: data?.checkout as Checkout, loading, refetch };
};
