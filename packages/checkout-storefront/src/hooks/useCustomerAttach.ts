import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout, useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";
import { useQueryVarsWithLocale } from "@/checkout-storefront/hooks/useQueryVarsWithLocale";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useCallback } from "react";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();
  const getQueryVarsWithLocale = useQueryVarsWithLocale();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  useCheckoutUpdateStateTrigger("checkoutCustomerAttach", fetching);

  const attachCustomer = useCallback(async () => {
    if (checkout?.user?.id === user?.id || fetching || loading) {
      return;
    }

    await customerAttach(
      getQueryVarsWithLocale({
        checkoutId: checkout.id,
      })
    );
  }, [
    checkout?.user?.id,
    checkout.id,
    user?.id,
    fetching,
    loading,
    customerAttach,
    getQueryVarsWithLocale,
  ]);

  useEffect(() => {
    void attachCustomer();
  }, [authenticated, attachCustomer]);
};
