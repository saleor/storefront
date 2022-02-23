import PageHeader from "@sections/PageHeader";
import { Summary } from "@sections/Summary";
import CheckoutForm from "@sections/CheckoutForm";
import { Suspense } from "react";
import { SummaryPlaceholder } from "@sections/Summary/SummaryPlaceholder";

export const Checkout = () => {
  return (
    <div className="app">
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
    </div>
  );
};
