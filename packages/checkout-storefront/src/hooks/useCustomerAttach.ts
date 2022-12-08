import { useCheckoutCustomerAttachMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useAuthState } from "@saleor/sdk";
import { useEffect } from "react";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

export const useCustomerAttach = () => {
  const { checkout, loading } = useCheckout();
  const { user, authenticated } = useAuthState();

  const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

  const handleSubmit = useSubmit<{}, typeof customerAttach>({
    scope: "checkoutCustomerAttach",
    shouldAbort: () => checkout?.user?.id === user?.id || fetching || loading,
    onSubmit: customerAttach,
    formDataParse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
  });

  useEffect(() => {
    void handleSubmit({});
  }, [authenticated, handleSubmit]);
};
