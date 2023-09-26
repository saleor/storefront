import { useEffect, useMemo } from "react";

import { type Checkout, useCheckoutQuery } from "@/checkout/src/graphql";
import { localeToLanguageCode } from "@/checkout/src/lib/utils/locale";
import { useLocale } from "@/checkout/src/hooks/useLocale";
import { extractCheckoutIdFromUrl } from "@/checkout/src/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout/src/state/updateStateStore";

export const useCheckout = ({ pause = false } = {}) => {
  const id = useMemo(() => extractCheckoutIdFromUrl(), []);
  const { locale } = useLocale();
  const { setLoadingCheckout } = useCheckoutUpdateStateActions();

  const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
    variables: { id, languageCode: localeToLanguageCode(locale) },
    pause: pause,
  });

  useEffect(() => setLoadingCheckout(loading || stale), [loading, setLoadingCheckout, stale]);

  return useMemo(
    () => ({ checkout: data?.checkout as Checkout, loading: loading || stale, refetch }),
    [data?.checkout, loading, refetch, stale]
  );
};
