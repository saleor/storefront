import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useEffect, useMemo } from "react";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { authenticated } = useUser();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  const onSubmit = useSubmit<{}, typeof customerAttach>(
    useMemo(
      () => ({
        scope: "checkoutCustomerAttach",
        shouldAbort: () => !!checkout?.user?.id || !authenticated || fetching || loading,
        onSubmit: customerAttach,
        parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
      }),
      [authenticated, checkout?.user?.id, customerAttach, fetching, loading]
    )
  );

  useEffect(() => {
    void onSubmit();
  }, [onSubmit]);
};
