import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useEffect, useMemo, useRef } from "react";
import { string } from "yup";

interface CheckoutEmailUpdateFormData {
  email: string;
}

export const useCheckoutEmailUpdate = ({ email }: CheckoutEmailUpdateFormData) => {
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const previousEmail = useRef(email);

  const isValidEmail = async (email: string) => {
    try {
      await string().email().validate(email);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit = useSubmit<CheckoutEmailUpdateFormData, typeof updateEmail>(
    useMemo(
      () => ({
        scope: "checkoutEmailUpdate",
        onSubmit: updateEmail,
        shouldAbort: async ({ formData: { email } }) => {
          const isValid = await isValidEmail(email);
          return !isValid;
        },
        parse: ({ languageCode, checkoutId, email }) => ({ languageCode, checkoutId, email }),
      }),
      [updateEmail]
    )
  );

  const debouncedSubmit = useDebouncedSubmit(onSubmit);

  useEffect(() => {
    const hasEmailChanged = email !== previousEmail.current;

    if (hasEmailChanged) {
      previousEmail.current = email;
      void debouncedSubmit({ email });
    }
  }, [debouncedSubmit, email]);
};
