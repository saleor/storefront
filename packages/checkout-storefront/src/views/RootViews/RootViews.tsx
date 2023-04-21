import { Checkout, CheckoutSkeleton } from "@/checkout-storefront/views/Checkout";
import {
  OrderConfirmation,
  OrderConfirmationSkeleton,
} from "@/checkout-storefront/views/OrderConfirmation";
import { Suspense } from "react";
import { DummyPayment } from "../DummyPayment/DummyPayment";
import { rootViewsMessages } from "./messages";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PaymentProcessingScreen } from "@/checkout-storefront/sections/PaymentSection/PaymentProcessingScreen";

export const RootViews = () => {
  const orderId = getQueryParams().orderId;
  const dummyPayment = getQueryParams().dummyPayment;
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
        <OrderConfirmation />
      </Suspense>
    );
  }

  return (
    <PaymentProcessingScreen>
      <Suspense fallback={<CheckoutSkeleton />}>
        <Checkout />
      </Suspense>
    </PaymentProcessingScreen>
  );
};
