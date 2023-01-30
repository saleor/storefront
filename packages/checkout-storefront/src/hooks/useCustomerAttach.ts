import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useMemo } from "react";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  const onSubmit = useSubmit<{}, typeof customerAttach>(
    useMemo(
      () => ({
        scope: "checkoutCustomerAttach",
        shouldAbort: () => checkout?.user?.id === user?.id || fetching || loading,
        onSubmit: customerAttach,
        parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
      }),
      [checkout?.user?.id, customerAttach, fetching, loading, user?.id]
    )
  );

  useEffect(() => {
    void onSubmit();
  }, [authenticated, onSubmit]);
};
