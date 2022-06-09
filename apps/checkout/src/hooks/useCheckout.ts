import { useMemo } from "react";

import { useCheckoutQuery } from "@/checkout/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout/lib/utils";
import { useAuthState } from "@saleor/sdk";

export const useCheckout = () => {
  const { authenticating } = useAuthState();
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: { id },
    pause: authenticating,
  });

  return { checkout: data?.checkout!, loading };
};
