import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useAuth, useAuthState } from "@saleor/sdk";

import { FormData } from "./types";
import { usePay } from "@/checkout-storefront/hooks/usePay";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { PayErrorResult } from "@/checkout-storefront/fetch";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";

export const useCheckoutFinalize = () => {
  const { checkout } = useCheckout();
  const { register } = useAuth();
  const { user } = useAuthState();
  const { checkoutPay, loading } = usePay();
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();
  const { showErrors, showCustomErrors } = useAlerts();
  const { errors, setApiErrors } = useErrors();

  const userRegister = async (formData: FormData): Promise<boolean> => {
    const { createAccount, email, password } = formData;

    if (user || !createAccount) {
      return true;
    }

    const registerFormData = { email, password };

    // adding redirect url because some saleor envs require it
    const result = await register({
      ...registerFormData,
      redirectUrl: location.href,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "userRegister");
      setApiErrors(errors);
      return !hasErrors;
    }

    return true;
  };

  const checkoutFinalize = async (formData: FormData) => {
    const userRegisterSuccessOrPassed = await userRegister(formData);

    if (userRegisterSuccessOrPassed) {
      const result = await checkoutPay({
        checkoutApiUrl,
        provider: formData.paymentProviderId,
        checkoutId: checkout?.id,
        totalAmount: checkout?.totalPrice?.gross?.amount as number,
      });
      if (!(result as PayErrorResult)?.ok) {
        const { errors } = result as PayErrorResult;
        showCustomErrors(errors, "checkoutPay");
      }
    }
  };

  return {
    checkoutFinalize,
    submitting: loading,
    errors,
  };
};
