import PageHeader from "@/checkout/sections/PageHeader";
import { Summary } from "@/checkout/sections/Summary";
import { CheckoutForm } from "@/checkout/sections/CheckoutForm";
import { Suspense } from "react";
import { SummarySkeleton } from "@/checkout/sections/Summary/SummarySkeleton";
import { PageNotFound } from "@/checkout/sections/PageNotFound";
import { ErrorBoundary } from "react-error-boundary";
import { useCheckout } from "./hooks/useCheckout";
import { useAuthState } from "@saleor/sdk";
import "./CheckoutStyles.css";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();

  const isCheckoutInvalid = !loading && !checkout && !authenticating;

  const isLoading = loading || authenticating;

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
                {isLoading ? <SummarySkeleton /> : <Summary />}
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
