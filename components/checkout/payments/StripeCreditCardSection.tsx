import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

import { useRegions } from "@/components/RegionsProvider";
import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import {
  CheckoutDetailsFragment,
  useCheckoutCompleteMutation,
  useCheckoutPaymentCreateMutation,
} from "@/saleor/api";

import CompleteCheckoutButton from "../CompleteCheckoutButton";

export const STRIPE_GATEWAY = "saleor.payments.stripe";

interface StripeCardFormInterface {
  checkout: CheckoutDetailsFragment;
}

const StripeCardForm = ({ checkout }: StripeCardFormInterface) => {
  const stripe = useStripe();
  const elements = useElements();
  const { formatPrice } = useRegions();
  const router = useRouter();
  const paths = usePaths();
  const { resetCheckoutToken } = useCheckout();
  const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
  const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const totalPrice = checkout.totalPrice?.gross;
  const payLabel = `Pay ${formatPrice(totalPrice)}`;
  const redirectToOrderDetailsPage = () => {
    resetCheckoutToken();

    router.push(paths.order.$url());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPaymentProcessing(true);

    if (elements === null || stripe === null) {
      setIsPaymentProcessing(false);

      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card element not initialized");
      setIsPaymentProcessing(false);
      return;
    }

    // Create Stripe payment
    const pR = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: checkout.email!,
        phone: checkout.billingAddress?.phone || "",
        name: `${checkout.billingAddress?.firstName} ${checkout.billingAddress?.lastName}`,
        address: {
          line1: checkout.billingAddress?.streetAddress1,
          city: checkout.billingAddress?.city,
          country: checkout.billingAddress?.country.code,
          postal_code: checkout.billingAddress?.postalCode,
        },
      },
    });

    if (pR.error || !pR.paymentMethod) {
      console.error("[error]", pR.error);
      setIsPaymentProcessing(false);
      return;
    }

    // Send Stripe payment data to the Saleor
    const { data: paymentCreateData, errors: paymentCreateErrors } =
      await checkoutPaymentCreateMutation({
        variables: {
          checkoutToken: checkout.token,
          paymentInput: {
            gateway: "saleor.payments.stripe",
            amount: checkout.totalPrice?.gross.amount,
            token: pR.paymentMethod.id,
          },
        },
      });

    if (paymentCreateErrors) {
      console.error(paymentCreateErrors);
      setIsPaymentProcessing(false);
      return;
    }

    // Try to complete the checkout
    const { data: completeData, errors: completeErrors } =
      await checkoutCompleteMutation({
        variables: {
          checkoutToken: checkout.token,
        },
      });
    if (completeErrors) {
      console.error("complete errors:", completeErrors);
      setIsPaymentProcessing(false);
      return;
    }

    let order = completeData?.checkoutComplete?.order;

    // Additional payment action is needed (ex. 3D Secure)
    if (completeData?.checkoutComplete?.confirmationNeeded) {
      // Parse data for the Stripe
      const confirmationData = JSON.parse(
        completeData?.checkoutComplete?.confirmationData || ""
      );

      // Execute additional action at Stripe
      const stripeConfirmationResponse = await stripe.confirmCardPayment(
        confirmationData.client_secret,
        {
          payment_method: pR.paymentMethod.id,
        }
      );

      if (stripeConfirmationResponse.error) {
        console.error(
          "Stripe payment confirmation error: ",
          stripeConfirmationResponse.error
        );
        setIsPaymentProcessing(false);
        return;
      }

      // Try to complete checkout
      const { data: confirmedCompleteData, errors: confirmedCompleteErrors } =
        await checkoutCompleteMutation({
          variables: {
            checkoutToken: checkout.token,
          },
        });

      if (confirmedCompleteErrors) {
        console.error(
          "Errors during checkout completion after the confirmation: ",
          confirmedCompleteErrors
        );
        setIsPaymentProcessing(false);
        return;
      }
      order = confirmedCompleteData?.checkoutComplete?.order;
    }

    // If there are no errors during payment and confirmation, order should be created
    if (order) {
      redirectToOrderDetailsPage();
      return;
    } else {
      console.error("Order was not created");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <CompleteCheckoutButton
        isProcessing={isPaymentProcessing}
        isDisabled={!stripe || !elements || isPaymentProcessing}
      >
        {payLabel}
      </CompleteCheckoutButton>
    </form>
  );
};

interface StripeCreditCardSectionInterface {
  checkout: CheckoutDetailsFragment;
}

export const StripeCreditCardSection: React.VFC<
  StripeCreditCardSectionInterface
> = ({ checkout }) => {
  const stripeGateway = checkout.availablePaymentGateways.find(
    (gateway) => gateway.id === STRIPE_GATEWAY
  );
  const stripeApiKey = stripeGateway?.config.find(
    (conf) => conf.field === "api_key"
  )?.value;

  if (!stripeApiKey) {
    return (
      <div className="py-8">
        <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
        <p>Stripe cannot be initialized - missing configuration</p>
      </div>
    );
  }
  const stripePromise = loadStripe(stripeApiKey);

  return (
    <div className="py-8">
      <Elements stripe={stripePromise}>
        <StripeCardForm checkout={checkout} />
      </Elements>
    </div>
  );
};

export default StripeCreditCardSection;
