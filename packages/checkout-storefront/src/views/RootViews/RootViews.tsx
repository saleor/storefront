import { getQueryVariables } from "@/checkout-storefront/lib/utils";
import { Checkout, CheckoutSkeleton } from "@/checkout-storefront/views/Checkout";
import {
  OrderConfirmation,
  OrderConfirmationSkeleton,
} from "@/checkout-storefront/views/OrderConfirmation";
import { Suspense } from "react";
import { DummyPayment } from "../DummyPayment/DummyPayment";
import { useFormattedMessages } from "../../hooks";
import { rootViewsMessages } from "./messages";

export const RootViews = () => {
  const orderId = getQueryVariables().orderId;
  const dummyPayment = getQueryVariables().dummyPayment;
  const formatMessage = useFormattedMessages();

  if (orderId) {
    if (dummyPayment) {
      return (
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              <span className="text-text-secondary">
                {formatMessage(rootViewsMessages.loadingWithDots)}
              </span>
            </div>
          }
        >
          <DummyPayment />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmation orderId={orderId} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout />
    </Suspense>
  );
};
