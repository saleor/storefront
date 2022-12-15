import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useAuthState } from "@saleor/sdk";
import { useEffect } from "react";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  const { onSubmit } = useSubmit<{}, typeof customerAttach>({
    scope: "checkoutCustomerAttach",
    shouldAbort: () => checkout?.user?.id === user?.id || fetching || loading,
    onSubmit: customerAttach,
    parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
  });

  useEffect(() => {
    void onSubmit();
  }, [authenticated, onSubmit]);
};
