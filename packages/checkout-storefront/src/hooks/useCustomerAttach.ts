import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout, useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useCallback } from "react";

export const useCustomerAttach = () => {
  const { checkout } = useCheckout();
  const { user, authenticated } = useAuthState();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  useCheckoutUpdateStateTrigger("checkoutCustomerAttach", fetching);

  const attachCustomer = useCallback(async () => {
    if (checkout?.user?.id === user?.id || fetching) {
      return;
    }

    await customerAttach({
      checkoutId: checkout.id,
    });
  }, [customerAttach, checkout?.user?.id, user?.id, fetching, checkout?.id]);

  useEffect(() => {
    void attachCustomer();
  }, [authenticated, attachCustomer]);
};
