import { useMemo } from "react";

import { useCheckoutQuery } from "@/checkout-storefront/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";

export const useCheckout = ({ pause = false }: { pause?: boolean }) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { authenticating } = useAuthState();

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: { id },
    pause: pause || authenticating,
  });

  return { checkout: data?.checkout!, loading };
};
