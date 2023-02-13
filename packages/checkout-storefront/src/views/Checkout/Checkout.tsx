import { PageHeader } from "@/checkout-storefront/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout-storefront/sections/CheckoutForm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();

  const isCheckoutInvalid = !loading && !checkout;

  const isEmptyCart = checkout && !checkout.lines.length;

  return isCheckoutInvalid ? (
    <PageNotFound />
  ) : (
    <ErrorBoundary FallbackComponent={PageNotFound}>
      <div className="page">
        <PageHeader />
        <div className="page-content">
          {isEmptyCart ? (
            <EmptyCartPage />
          ) : (
            <>
              <Suspense fallback={<CheckoutFormSkeleton />}>
                <CheckoutForm />
              </Suspense>
              <div className="page-divider" />
              <Suspense fallback={<SummarySkeleton />}>
                <Summary {...checkout} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
