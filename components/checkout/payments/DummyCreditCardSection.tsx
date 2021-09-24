import React, { useState } from "react";
import {
  CheckoutDetailsFragment,
  useCheckoutCompleteMutation,
  useCheckoutPaymentCreateMutation,
} from "@/saleor/api";
import { useRouter } from "next/router";
import CompleteCheckoutButton from "../CompleteCheckoutButton";
import { CHECKOUT_TOKEN } from "@/lib/const";
import { useForm } from "react-hook-form";

export const DUMMY_CREDIT_CARD_GATEWAY = "mirumee.payments.dummy";

interface CardForm {
  cardNumber: string;
  expDate: string;
  cvc: string;
}

interface DummyCreditCardSectionInterface {
  checkout: CheckoutDetailsFragment;
}

export const DummyCreditCardSection: React.VFC<DummyCreditCardSectionInterface> =
  ({ checkout }) => {
    const gateway = checkout.availablePaymentGateways.find(
      (gateway) => gateway.id === DUMMY_CREDIT_CARD_GATEWAY
    );
    const router = useRouter();
    const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
    const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const totalPrice = checkout.totalPrice?.gross;
    const payLabel = `Pay ${!!totalPrice ? totalPrice.localizedAmount : ""}`;

    const {
      register: registerCard,
      handleSubmit: handleSubmitCard,
      formState: { errors: errorsAddress },
      setError: setErrorCard,
    } = useForm<CardForm>({});

    const redirectToOrderDetailsPage = (orderToken: string) => {
      // remove completed checkout
      localStorage.removeItem(CHECKOUT_TOKEN);

      // redirect to the order details page
      router.push({
        pathname: "/order/[token]",
        query: { token: orderToken },
      });
    };

    const handleSubmit = handleSubmitCard(async (formData: CardForm) => {
      setIsPaymentProcessing(true);

      // Create Saleor payment
      const { data: paymentCreateData, errors: paymentCreateErrors } =
        await checkoutPaymentCreateMutation({
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
        console.log(paymentCreateErrors);
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
        console.log("complete errors:", completeErrors);
        setIsPaymentProcessing(false);
        return;
      }

      let order = completeData?.checkoutComplete?.order;
      // If there are no errors during payment and confirmation, order should be created
      if (order) {
        redirectToOrderDetailsPage(order.token);

        return;
      } else {
        console.log("Order was not created");
      }
    });

    return (
      <div className="py-8">
        <form onSubmit={handleSubmit}>
          <div className="py-8">
            <div className="mt-4 grid grid-cols-12 gap-x-2 gap-y-4">
              <div className="col-span-6">
                <label
                  htmlFor="card-number"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Card number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="card-number"
                    className="block w-full border-gray-300 rounded-md shadow-sm"
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
                  Expiration date
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="expiration-date"
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="MM / YY"
                    {...registerCard("expDate", {
                      required: true,
                    })}
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="cvc"
                  className="block text-sm font-semibold text-gray-700"
                >
                  CVC
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="cvc"
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                    {...registerCard("cvc", {
                      required: true,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <CompleteCheckoutButton
            isProcessing={isPaymentProcessing}
            isDisabled={isPaymentProcessing}
          >
            {payLabel}
          </CompleteCheckoutButton>
        </form>
      </div>
    );
  };

export default DummyCreditCardSection;
