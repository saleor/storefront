import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";
import { isValidEmail } from "@/checkout-storefront/lib/utils/common";
import { useEffect, useMemo, useRef } from "react";

interface CheckoutEmailUpdateFormData {
  email: string;
}

export const useCheckoutEmailUpdate = ({ email }: CheckoutEmailUpdateFormData) => {
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const previousEmail = useRef(email);

  const onSubmit = useSubmit<CheckoutEmailUpdateFormData, typeof updateEmail>(
    useMemo(
      () => ({
        scope: "checkoutEmailUpdate",
        onSubmit: updateEmail,
        shouldAbort: async ({ formData: { email } }) => {
          // @todo we'll use validateField once we fix it because
          // https://github.com/jaredpalmer/formik/issues/1755
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
