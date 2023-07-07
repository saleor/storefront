import { ApolloError } from "@apollo/client";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { CHECKOUT_TOKEN } from "@/lib/const";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { DEFAULT_LOCALE, localeToEnum } from "@/lib/regions";
import createSafeContext from "@/lib/useSafeContext";
import { CheckoutDetailsFragment, useCheckoutByTokenQuery } from "@/saleor/api";

export interface CheckoutConsumerProps {
  checkoutToken: string;
  setCheckoutToken: (token: string) => void;
  resetCheckoutToken: () => void;
  checkout: CheckoutDetailsFragment | undefined | null;
  checkoutError: ApolloError | undefined;
  loading: boolean;
}

export const [useCheckout, Provider] = createSafeContext<CheckoutConsumerProps>();

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = router.query.locale?.toString() || DEFAULT_LOCALE;

  const [checkoutToken, setCheckoutToken] = useLocalStorage(CHECKOUT_TOKEN, "", { sync: true });

  const {
    data,
    loading,
    error: checkoutError,
  } = useCheckoutByTokenQuery({
    variables: { checkoutToken, locale: localeToEnum(locale) },
    skip: !checkoutToken || typeof window === "undefined",
    fetchPolicy: "cache-and-network",
  });

  const resetCheckoutToken = () => setCheckoutToken("");

  const providerValues: CheckoutConsumerProps = {
    checkoutToken,
    setCheckoutToken,
    resetCheckoutToken,
    checkout: data?.checkout,
    loading,
    checkoutError,
  };

  return <Provider value={providerValues}>{children}</Provider>;
}
