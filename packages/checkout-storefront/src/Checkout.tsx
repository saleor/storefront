import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { Summary } from "@/checkout-storefront/sections/Summary";
import { CheckoutForm } from "@/checkout-storefront/sections/CheckoutForm";
import { Suspense } from "react";
import { SummarySkeleton } from "@/checkout-storefront/sections/Summary/SummarySkeleton";
import { PageNotFound } from "@/checkout-storefront/sections/PageNotFound";
import { ErrorBoundary } from "react-error-boundary";
import { useCheckout } from "./hooks/useCheckout";
import { useAuthState } from "@saleor/sdk";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();

  const isCheckoutInvalid = !loading && !checkout && !authenticating;

  return (
    <div className="app">
      {isCheckoutInvalid ? (
        <PageNotFound />
      ) : (
        /* @ts-ignore React 17 <-> 18 type mismatch */
        <ErrorBoundary FallbackComponent={PageNotFound}>
          <div className="page">
            <PageHeader />
            <div className="page-content">
              <CheckoutForm />
              <div className="page-divider" />
              <Suspense fallback={<SummarySkeleton />}>
                <Summary />
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
