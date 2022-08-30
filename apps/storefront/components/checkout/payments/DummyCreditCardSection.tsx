import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { useRegions } from "@/components/RegionsProvider";
import { messages } from "@/components/translations";
import { DEMO_MODE } from "@/lib/const";
import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import {
  CheckoutDetailsFragment,
  useCheckoutCompleteMutation,
  useCheckoutPaymentCreateMutation,
} from "@/saleor/api";

import { CompleteCheckoutButton } from "../CompleteCheckoutButton";

export const DUMMY_CREDIT_CARD_GATEWAY = "mirumee.payments.dummy";

interface CardForm {
  cardNumber: string;
  expDate: string;
  cvc: string;
}

interface DummyCreditCardSectionInterface {
  checkout: CheckoutDetailsFragment;
}

export function DummyCreditCardSection({ checkout }: DummyCreditCardSectionInterface) {
  const t = useIntl();
  const { resetCheckoutToken } = useCheckout();
  const paths = usePaths();
  const router = useRouter();
  const { formatPrice } = useRegions();
  const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
  const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const totalPrice = checkout.totalPrice?.gross;
  const payLabel = t.formatMessage(messages.paymentButton, {
    total: formatPrice(totalPrice),
  });

  const defaultValues = DEMO_MODE
    ? {
        cardNumber: "4242 4242 4242 4242",
        expDate: "12/34",
        cvc: "123",
      }
    : {};

  const { register: registerCard, handleSubmit: handleSubmitCard } = useForm<CardForm>({
    defaultValues,
  });

  const redirectToOrderDetailsPage = async () => {
    // without the `await` checkout data will be removed before the redirection which will cause issue with rendering checkout view
    await router.push(paths.order.$url());
    resetCheckoutToken();
  };

  const handleSubmit = handleSubmitCard(async (formData: CardForm) => {
    setIsPaymentProcessing(true);

    // Create Saleor payment
    const { errors: paymentCreateErrors } = await checkoutPaymentCreateMutation({
      variables: {
        checkoutToken: checkout.token,
        paymentInput: {
          gateway: DUMMY_CREDIT_CARD_GATEWAY,
          amount: checkout.totalPrice?.gross.amount,
          token: formData.cardNumber,
        },
      },
    });

    if (paymentCreateErrors) {
      console.error(paymentCreateErrors);
      setIsPaymentProcessing(false);
      return;
    }

    // Try to complete the checkout
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

    const order = completeData?.checkoutComplete?.order;
    // If there are no errors during payment and confirmation, order should be created
    if (order) {
      return redirectToOrderDetailsPage();
    } else {
      console.error("Order was not created");
    }
  });

  return (
    <div className="py-8">
      <form onSubmit={handleSubmit}>
        <div className="py-8">
          <div className="mt-4 grid grid-cols-12 gap-x-2 gap-y-4">
            <div className="col-span-6">
              <label htmlFor="card-number" className="block text-sm font-semibold text-gray-700">
                {t.formatMessage(messages.cardNumberField)}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card-number"
                  className="block w-full border-gray-300 rounded-md shadow-sm text-base"
                  {...registerCard("cardNumber", {
                    required: true,
                  })}
                />
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="expiration-date"
                className="block text-sm font-semibold text-gray-700"
              >
                {t.formatMessage(messages.expDateField)}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="expiration-date"
                  className="block w-full border-gray-300 rounded-md shadow-sm text-base"
                  placeholder="MM / YY"
                  {...registerCard("expDate", {
                    required: true,
                  })}
                />
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="cvc" className="block text-sm font-semibold text-gray-700">
                {t.formatMessage(messages.cvcField)}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="cvc"
                  className="block w-full border-gray-300 rounded-md shadow-sm text-base"
                  {...registerCard("cvc", {
                    required: true,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        <CompleteCheckoutButton isProcessing={isPaymentProcessing} isDisabled={isPaymentProcessing}>
          {payLabel}
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default DummyCreditCardSection;
