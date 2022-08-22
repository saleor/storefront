import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout-storefront/sections/CheckoutForm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuthState } from "@saleor/sdk";
import { useCheckout } from "@/checkout-storefront/hooks";
import { EmptyCartPage, PageNotFound } from "@/checkout-storefront/views";
import { CheckoutSkeleton } from "./CheckoutSkeleton";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();

  const isCheckoutInvalid = !loading && !checkout && !authenticating;

  const isEmptyCart = checkout && !checkout?.lines.length;

  return isCheckoutInvalid ? (
    <PageNotFound />
  ) : authenticating ? (
    <CheckoutSkeleton />
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
                <Summary />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
