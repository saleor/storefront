import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useEffect, useRef } from "react";

interface CheckoutEmailUpdateFormData {
  email: string;
}

export const useCheckoutEmailUpdate = ({ email }: CheckoutEmailUpdateFormData) => {
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const previousEmail = useRef(email);

  const { debouncedSubmit } = useSubmit<CheckoutEmailUpdateFormData, typeof updateEmail>({
    scope: "checkoutEmailUpdate",
    onSubmit: updateEmail,
    parse: ({ languageCode, checkoutId, email }) => ({ languageCode, checkoutId, email }),
  });

  useEffect(() => {
    if (email !== previousEmail.current) {
      previousEmail.current = email;
      void debouncedSubmit({ email });
    }
  }, [debouncedSubmit, email]);
};
