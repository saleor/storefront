import React, { useState, FormEvent } from "react";
import CompleteCheckoutButton from "./CompleteCheckoutButton";

import { useCheckoutPaymentCreateMutation } from "./useCheckoutPaymentCreateMutation";
import { useCheckoutComplete } from "@/checkout-storefront/hooks/useCheckoutComplete";
import { useIntl } from "react-intl";
import { paymentSectionMessages } from "./messages";
import { GDPRSection } from "../GDPRSection/GDPRSection";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { Checkout } from "@/checkout-storefront/graphql";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}
export const COD_GATEWAY = "salingo.payments.cod";

export function CodSection({ checkout }: { checkout: Checkout }) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [GDPR, setGDPR] = useState<boolean>(false);
  const [, checkoutPaymentCreate] = useCheckoutPaymentCreateMutation();
  const { onCheckoutComplete } = useCheckoutComplete();
  const { showCustomErrors } = useAlerts();

  const t = useIntl();

  const handleGDPRChange = (checked: boolean) => {
    setGDPR(checked);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!checkout.email) {
      return showCustomErrors([
        {
          field: "email",
          code: "required",
          message: "Proszę wprowadzić adres email.",
        },
      ]);
    }

    if (!GDPR) {
      console.log("Musisz zaakceptować regulamin sklepu przed kontynuacją płatności!");
      return;
    }

    setIsPaymentProcessing(true);

    try {
      if (!checkout.token) {
        throw new Error("Invalid checkout token");
      }

      const paymentResponse = await checkoutPaymentCreate({
        checkoutToken: checkout.token,
        paymentInput: {
          gateway: "salingo.payments.cod",
          amount: checkout.totalPrice?.gross.amount,
          token: checkout.token,
        },
      });

      const paymentId = paymentResponse.data?.checkoutPaymentCreate?.payment?.id;

      if (!paymentId) {
        throw new Error("Failed to create payment");
      }

      if (paymentId) {
        await onCheckoutComplete();
      } else {
        throw new Error("Failed to create payment");
      }
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
          {t.formatMessage(paymentSectionMessages.payOnDelivery)}
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default CodSection;
