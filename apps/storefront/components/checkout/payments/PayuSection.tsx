import React, { useState, FormEvent } from "react";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import {
  CheckoutDetailsFragment,
  useCheckoutCompleteMutation,
  useCheckoutPaymentCreateMutation,
} from "@/saleor/api";

import { CompleteCheckoutButton } from "../CompleteCheckoutButton";

import { API_URI, CHANNEL_SLUG } from "@/lib/const";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}
export const PAYU_GATEWAY = "salingo.payments.payu";

interface PayuSectionInterface {
  checkout: CheckoutDetailsFragment;
}

export function PayuSection({ checkout }: PayuSectionInterface) {
  const { resetCheckoutToken } = useCheckout();
  const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
  const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const generatePayuUrl = async (paymentId: string) => {
    const payuUrlQuery = `
      query generatePaymentUrl($paymentId: ID!, $channel: String!) {
        generatePaymentUrl(paymentId: $paymentId, channel: $channel) {
          paymentUrl
        }
      }
    `;

    try {
      const response = await fetch(API_URI, {
        method: "POST",
        body: JSON.stringify({
          query: payuUrlQuery,
          variables: {
            paymentId: paymentId,
            channel: CHANNEL_SLUG,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      const payuUrl = data?.data?.generatePaymentUrl?.paymentUrl;
      return payuUrl;
    } catch (error) {
      console.error("Failed to generate PayU URL:", error);
      throw new Error("Failed to generate PayU URL");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPaymentProcessing(true);

    try {
      if (!checkout.token) {
        throw new Error("Invalid checkout token");
      }

      const paymentResponse = await checkoutPaymentCreateMutation({
        variables: {
          checkoutToken: checkout.token,
          paymentInput: {
            gateway: "salingo.payments.payu",
            amount: checkout.totalPrice?.gross.amount,
            token: checkout.token,
          },
        },
      });

      const paymentId = paymentResponse.data?.checkoutPaymentCreate?.payment?.id;

      if (!paymentId) {
        throw new Error("Failed to create payment");
      }

      const payuUrl = await generatePayuUrl(paymentId);

      if (payuUrl) {
        window.location.href = payuUrl;
        const { errors: completeErrors } = await checkoutCompleteMutation({
          variables: {
            checkoutToken: checkout.token,
          },
        });
        if (completeErrors) {
          console.error("complete errors:", completeErrors);
          setIsPaymentProcessing(false);
          return;
        }
        resetCheckoutToken();
      } else {
        throw new Error("Failed to generate PayU URL");
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="py-8">
      <form method="post" onSubmit={handleSubmit}>
        <CompleteCheckoutButton isProcessing={isPaymentProcessing} isDisabled={isPaymentProcessing}>
          Zapłać z PayU
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default PayuSection;
