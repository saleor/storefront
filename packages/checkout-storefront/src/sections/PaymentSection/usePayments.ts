import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout-storefront/hooks/useCheckoutComplete";
import { usePaymentGatewaysInitialize } from "@/checkout-storefront/sections/PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "@/checkout-storefront/sections/PaymentSection/utils";
import { useEffect } from "react";

export const usePayments = () => {
  const { checkout } = useCheckout();
  const paymentStatus = usePaymentStatus(checkout);

  const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

  const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

  useEffect(() => {
    // the checkout was already paid earlier, complete
    if (
      !completingCheckout &&
      ["overpaid", "paidInFull", "authentorized"].includes(paymentStatus)
    ) {
      void onCheckoutComplete();
    }
  }, []);

  return { fetching, availablePaymentGateways };
};
