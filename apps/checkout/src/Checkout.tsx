import PageHeader from "@sections/PageHeader";
import { Summary } from "@sections/Summary";
import { CheckoutForm } from "@sections/CheckoutForm";
import { Suspense } from "react";
import { SummaryPlaceholder } from "@sections/Summary/SummaryPlaceholder";
import { extractTokenFromUrl } from "@lib/utils";
import { PageNotFound } from "@sections/PageNotFound";
import { ErrorBoundary } from "react-error-boundary";

export const Checkout = () => {
  const token = extractTokenFromUrl();

  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={PageNotFound}>
        {token ? (
          <div className="page">
            <PageHeader />
            <div className="page-content">
              <CheckoutForm />
              <div className="page-divider" />
              <Suspense fallback={<SummaryPlaceholder />}>
                <Summary />
              </Suspense>
            </div>
          </div>
        ) : (
          <PageNotFound />
        )}
      </ErrorBoundary>
    </div>
  );
};
