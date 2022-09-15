import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useAuth, useAuthState } from "@saleor/sdk";

import { usePay } from "@/checkout-storefront/hooks/usePay";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { useEffect } from "react";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";

export const useCheckoutFinalize = () => {
  const { checkout } = useCheckout();
  const { register } = useAuth();
  const { user } = useAuthState();
  const { checkoutPay, loading, error: payError, data: _payData } = usePay();
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();
  const { showErrors, showCustomErrors } = useAlerts();
  const { errors, setApiErrors } = useErrors<CheckoutFormData>();

  useEffect(() => {
    // @todo should this show a notification?
    console.error(payError);
  }, [payError]);

  const userRegister = async (formData: CheckoutFormData): Promise<boolean> => {
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

  const checkoutFinalize = async (formData: CheckoutFormData) => {
    const userRegisterSuccessOrPassed = await userRegister(formData);

    if (userRegisterSuccessOrPassed) {
      const result = await checkoutPay({
        checkoutApiUrl,
        provider: formData.paymentProviderId,
        method: formData.paymentMethodId,
        checkoutId: checkout?.id,
        totalAmount: checkout?.totalPrice?.gross?.amount,
      });

      if (!result) {
        console.error("Unexpected empty result!", { result });
        return;
      }

      if ("ok" in result && result.ok === false) {
        const { errors } = result;

        const parsedErrors = errors.map((error) => ({
          code: error,
        }));

        showCustomErrors(parsedErrors, "checkoutPay");
      }
    }
  };

  return {
    checkoutFinalize,
    submitting: loading,
    errors,
  };
};
