import { useMemo } from "react";

import { useCheckoutQuery } from "@/checkout-storefront/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils";

export const useCheckout = () => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: { id },
  });

  return { checkout: data?.checkout!, loading };
};
