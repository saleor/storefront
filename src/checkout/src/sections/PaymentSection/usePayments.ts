import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/src/hooks/useCheckoutComplete";
import { type PaymentStatus } from "@/checkout/src/sections/PaymentSection/types";
import { usePaymentGatewaysInitialize } from "@/checkout/src/sections/PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "@/checkout/src/sections/PaymentSection/utils";
import { useEffect } from "react";

const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

export const usePayments = () => {
  const { checkout } = useCheckout();
  const paymentStatus = usePaymentStatus(checkout);

  const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

  const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

  useEffect(() => {
    // the checkout was already paid earlier, complete
    if (!completingCheckout && paidStatuses.includes(paymentStatus)) {
      void onCheckoutComplete();
    }
  }, []);

  return { fetching, availablePaymentGateways };
};
