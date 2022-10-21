import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout, useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useCallback } from "react";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();
  const { locale } = useLocale();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  useCheckoutUpdateStateTrigger("checkoutCustomerAttach", fetching);

  const attachCustomer = useCallback(async () => {
    if (checkout?.user?.id === user?.id || fetching || loading) {
      return;
    }

    await customerAttach({
      checkoutId: checkout.id,
      languageCode: localeToLanguageCode(locale),
    });
  }, [checkout?.user?.id, checkout.id, user?.id, fetching, loading, customerAttach, locale]);

  useEffect(() => {
    void attachCustomer();
  }, [authenticated, attachCustomer]);
};
