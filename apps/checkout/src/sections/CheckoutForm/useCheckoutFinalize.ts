import { useCheckout } from "@/checkout/hooks/useCheckout";
import { usePay } from "@/checkout/hooks/usePay";
import { extractMutationErrors } from "@/checkout/lib/utils";
import { useErrors } from "@/checkout/providers/ErrorsProvider";
import { useAuth, useAuthState } from "@saleor/sdk";
import { omit } from "lodash-es";

import { FormData } from "./types";

export const useCheckoutFinalize = () => {
  const { checkout } = useCheckout();
  const { register } = useAuth();
  const { user } = useAuthState();
  const { checkoutPay, loading } = usePay();
  const { setApiErrors, hasErrors } = useErrors<FormData>("userRegister");

  const handleUserRegister = async (formData: FormData) => {
    const registerFormData = omit(formData, "createAccount");
    // adding redirect url because api is broken and requires it
    // despite te types saying otherwise
    const result = await register({ ...registerFormData, redirectUrl: "" });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setApiErrors(errors);
    }
  };

  const checkoutFinalize = async (formData: FormData) => {
    if (!user && formData.createAccount) {
      await handleUserRegister(formData);
    }

    if (!hasErrors) {
      checkoutPay({
        provider: "adyen",
        checkoutId: checkout?.id,
        totalAmount: checkout?.totalPrice?.gross?.amount as number,
      });
    }
  };

  return { checkoutFinalize, submitting: loading };
};
