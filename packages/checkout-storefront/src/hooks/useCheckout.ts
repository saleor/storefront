import { useEffect, useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout-storefront/state/updateStateStore";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { locale } = useLocale();
  const { isAuthenticating } = useSaleorAuthContext();
  const { setLoadingCheckout } = useCheckoutUpdateStateActions();

  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: { id, languageCode: localeToLanguageCode(locale) },
    pause: pause || isAuthenticating,
  });

  useEffect(() => setLoadingCheckout(loading || stale), [loading, setLoadingCheckout, stale]);

  return useMemo(
    () => ({ checkout: data?.checkout as Checkout, loading: loading || stale, refetch }),
    [data?.checkout, loading, refetch, stale]
  );
};
