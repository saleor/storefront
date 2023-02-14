import { useEffect, useMemo } from "react";

import { Checkout, useCheckoutQuery } from "@/checkout-storefront/graphql";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { extractCheckoutIdFromUrl } from "@/checkout-storefront/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout-storefront/state/updateStateStore";
import { useAuthProvider } from "@/checkout-storefront/lib/auth";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { locale } = useLocale();
  const { isAuthenticating } = useAuthProvider();
  const { setLoadingCheckout } = useCheckoutUpdateStateActions();

  console.log(111, { isAuthenticating });
  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: { id, languageCode: localeToLanguageCode(locale) },
    // pause: pause || isAuthenticating,
  });

  useEffect(() => setLoadingCheckout(loading || stale), [loading, setLoadingCheckout, stale]);

  console.log(123, { che: data?.checkout, loading, stale, isAuthenticating, pause });
  return useMemo(
    () => ({ checkout: data?.checkout as Checkout, loading: loading || stale, refetch }),
    [data?.checkout, loading, refetch, stale]
  );
};
