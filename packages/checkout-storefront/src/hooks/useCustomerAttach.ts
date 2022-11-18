import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useCheckoutUpdateStateStore } from "@/checkout-storefront/hooks/useCheckoutUpdateStateStore";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { extractMutationErrors, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useCallback } from "react";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();
  const { locale } = useLocale();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  const setCheckoutUpdateState = useCheckoutUpdateStateStore((state) =>
    state.setUpdateState("checkoutCustomerAttach")
  );

  const attachCustomer = useCallback(async () => {
    if (checkout?.user?.id === user?.id || fetching || loading) {
      return;
    }

    setCheckoutUpdateState("loading");

    const response = await customerAttach({
      checkoutId: checkout.id,
      languageCode: localeToLanguageCode(locale),
    });

    const [hasErrors] = extractMutationErrors(response);

    setCheckoutUpdateState(hasErrors ? "error" : "success");
  }, [checkout?.user?.id, checkout.id, user?.id, fetching, loading, customerAttach, locale]);

  useEffect(() => {
    void attachCustomer();
  }, [authenticated, attachCustomer]);
};
