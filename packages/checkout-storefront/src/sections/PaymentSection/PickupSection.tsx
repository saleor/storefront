import React, { useState, FormEvent } from "react";
import CompleteCheckoutButton from "./CompleteCheckoutButton";

import { useCheckoutPaymentCreateMutation } from "./useCheckoutPaymentCreateMutation";
import { useCheckoutComplete } from "@/checkout-storefront/hooks/useCheckoutComplete";
import { GDPRSection } from "../GDPRSection/GDPRSection";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}
export const PICKUP_GATEWAY = "salingo.payments.cod";

export function PickupSection({ checkout }: any) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [GDPR, setGDPR] = useState<boolean>(false);
  const [, checkoutPaymentCreate] = useCheckoutPaymentCreateMutation();
  const { onCheckoutComplete } = useCheckoutComplete();

  const handleGDPRChange = (checked: boolean) => {
    setGDPR(checked);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    console.log("Submit button clicked.");

    if (!GDPR) {
      console.log("Musisz zaakceptować regulamin sklepu przed kontynuacją płatności!");
      return;
    }

    console.log("Payment processing started...");

    setIsPaymentProcessing(true);

    try {
      if (!checkout.token) {
        throw new Error("Invalid checkout token");
      }

      console.log("Creating payment...");

      const paymentResponse = await checkoutPaymentCreate({
        checkoutToken: checkout.token,
        paymentInput: {
          gateway: PICKUP_GATEWAY,
          amount: checkout.totalPrice?.gross.amount,
          token: checkout.token,
        },
      });

      console.log("Payment response:", paymentResponse);

      const paymentId = paymentResponse.data?.checkoutPaymentCreate?.payment?.id;

      if (!paymentId) {
        console.error("Failed to create payment");
        throw new Error("Failed to create payment");
      }

      console.log("Payment created with ID:", paymentId);

      await onCheckoutComplete();
    } catch (error) {
      console.error("Error during payment processing:", error);
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="py-2">
      <form method="post" onSubmit={handleSubmit}>
        <GDPRSection checked={GDPR} onChange={() => handleGDPRChange(!GDPR)} />
        <CompleteCheckoutButton
          isProcessing={isPaymentProcessing}
          isDisabled={isPaymentProcessing || !GDPR}
        >
          Zapłać za pobraniem
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default PickupSection;
