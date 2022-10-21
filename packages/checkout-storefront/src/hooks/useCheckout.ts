import { useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { extractCheckoutIdFromUrl, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { locale } = useLocale();
  const { authenticating } = useAuthState();

  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: { id, languageCode: localeToLanguageCode(locale) },
    pause: pause || authenticating,
  });

  return { checkout: data?.checkout as Checkout, loading: loading || stale, refetch };
};
