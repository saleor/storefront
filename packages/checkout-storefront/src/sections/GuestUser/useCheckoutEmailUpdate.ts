import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useEffect } from "react";

interface CheckoutEmailUpdateFormData {
  email: string;
}

export const useCheckoutEmailUpdate = ({ email }: CheckoutEmailUpdateFormData) => {
  const [, updateEmail] = useCheckoutEmailUpdateMutation();

  const { debouncedSubmit } = useSubmit<CheckoutEmailUpdateFormData, typeof updateEmail>({
    scope: "checkoutEmailUpdate",
    onSubmit: updateEmail,
    formDataParse: ({ languageCode, checkoutId, email }) => ({ languageCode, checkoutId, email }),
  });

  useEffect(() => {
    void debouncedSubmit({ email });
  }, [debouncedSubmit, email]);
};
