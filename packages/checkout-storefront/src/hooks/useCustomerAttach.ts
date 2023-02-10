import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useEffect, useMemo } from "react";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useUser();

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
    console.log("YOOOO");
    void onSubmit();
  }, [onSubmit, authenticated]);
};
