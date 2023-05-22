import { Checkout, CheckoutSkeleton } from "@/checkout-storefront/views/Checkout";
import {
  OrderConfirmation,
  OrderConfirmationSkeleton,
} from "@/checkout-storefront/views/OrderConfirmation";
import { Suspense } from "react";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { PaymentProcessingScreen } from "@/checkout-storefront/sections/PaymentSection/PaymentProcessingScreen";

export const RootViews = () => {
  const orderId = getQueryParams().orderId;

  if (orderId) {
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
