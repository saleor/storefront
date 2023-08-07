import React, { useState, FormEvent } from "react";
import { useIntl } from "react-intl";

import { useRegions } from "@/components/RegionsProvider";
import { messages } from "@/components/translations";
import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import {
  CheckoutDetailsFragment,
  PayuRedirectUrlQueryDocument,
  useCheckoutCompleteMutation,
  useCheckoutPaymentCreateMutation,
} from "@/saleor/api";

import { CompleteCheckoutButton } from "../CompleteCheckoutButton";
import { useRouter } from "next/router";

// Add these import statements
import { API_URI, CHANNEL_SLUG } from "@/lib/const";
import { gql } from "@apollo/client";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}
export const PAYU_GATEWAY = "salingo.payments.payu";

interface PayuSectionInterface {
  checkout: CheckoutDetailsFragment;
}

export function PayuSection({ checkout }: PayuSectionInterface) {
  const router = useRouter();
  const paths = usePaths();
  const { resetCheckoutToken } = useCheckout();
  const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
  const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const redirectToOrderDetailsPage = () => {
    resetCheckoutToken();
    void router.push(paths.order.$url());
  };

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
      console.log("PayU URL:", payuUrl); // Log the generated PayU URL
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
      // Ensure checkout.token is valid before proceeding
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

      // Generate PayU URL
      const payuUrl = await generatePayuUrl(paymentId);

      if (payuUrl) {
        // Redirect the user to the PayU payment page
        window.location.href = payuUrl;

        const { data: completeData, errors: completeErrors } = await checkoutCompleteMutation({
          variables: {
            checkoutToken: checkout.token,
          },
        });
        if (completeErrors) {
          console.error("complete errors:", completeErrors);
          setIsPaymentProcessing(false);
          return;
        }
        order = completeData?.checkoutComplete?.order;
      } else {
        // If payuUrl is null, throw an error to be caught in the catch block
        throw new Error("Failed to generate PayU URL");
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="py-2">
      <form method="post" onSubmit={handleSubmit}>
        <CompleteCheckoutButton isProcessing={isPaymentProcessing} isDisabled={isPaymentProcessing}>
          Zapłać z PayU
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default PayuSection;
