import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

import { usePay } from "@/checkout-storefront/hooks/usePay";
import { useCallback, useEffect } from "react";
import { useSelectedPaymentData } from "@/checkout-storefront/state/paymentDataStore";

export const useCheckoutFinalize = () => {
  const { checkout } = useCheckout();
  const { checkoutPay, loading, error: payError, data: _payData } = usePay();
  const { paymentMethod, paymentProvider } = useSelectedPaymentData();

  useEffect(() => {
    // @todo should this show a notification?
    if (payError) {
      console.error(payError);
    }
  }, [payError]);

  const checkoutFinalize = useCallback(async () => {
    if (!paymentMethod || !paymentProvider) {
      return;
    }

    const result = await checkoutPay({
      provider: paymentProvider,
      method: paymentMethod,
      checkoutId: checkout?.id,
      totalAmount: checkout?.totalPrice?.gross?.amount,
    });

    if (!result) {
      console.error("Unexpected empty result!", { result });
      return;
    }

    if ("ok" in result && result.ok === false) {
      // for now api doesn't return errors in some cases
      // const { errors } = result;
      // const parsedErrors = errors.map((error) => ({
      //   code: error,
      // }));
      // showCustomErrors(parsedErrors, "checkoutPay");
    }
  }, [
    checkout?.id,
    checkout?.totalPrice?.gross?.amount,
    checkoutPay,
    paymentMethod,
    paymentProvider,
  ]);

  return {
    checkoutFinalize,
    finalizing: loading,
  };
};
