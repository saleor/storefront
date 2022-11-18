import { useEffect, useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils/url";
import { useCheckoutUpdateStateStore } from "@/checkout-storefront/hooks/useCheckoutUpdateStateStore";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { locale } = useLocale();
  const { authenticating } = useAuthState();
  const setCheckoutLoading = useCheckoutUpdateStateStore((state) => state.setLoadingCheckout);

  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: { id, languageCode: localeToLanguageCode(locale) },
    pause: pause || authenticating,
  });

  useEffect(() => setCheckoutLoading(loading || stale), [loading, stale]);

  return { checkout: data?.checkout as Checkout, loading: loading || stale, refetch };
};
