import { PageHeader } from "@/checkout-storefront/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout-storefront/sections/CheckoutForm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { CheckoutSkeleton } from "@/checkout-storefront/views/Checkout/CheckoutSkeleton";
import { PAGE_ID } from "@/checkout-storefront/views/Checkout/consts";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();
  const { isAuthenticating } = useSaleorAuthContext();

  const isCheckoutInvalid = !loading && !checkout && !isAuthenticating;

  const isInitiallyAuthenticating = isAuthenticating && !checkout;

  const isEmptyCart = checkout && !checkout.lines.length;

  return isCheckoutInvalid ? (
    <PageNotFound />
  ) : isInitiallyAuthenticating ? (
    <CheckoutSkeleton />
  ) : (
    <ErrorBoundary FallbackComponent={PageNotFound}>
      <div className="page" id={PAGE_ID}>
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
