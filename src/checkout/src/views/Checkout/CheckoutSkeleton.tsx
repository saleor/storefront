import { CheckoutFormSkeleton } from "@/checkout/src/sections/CheckoutForm";
import { PageHeader } from "@/checkout/src/sections/PageHeader";
import { SummarySkeleton } from "@/checkout/src/sections/Summary";

export const CheckoutSkeleton = () => (
  <div className="app">
    <div className="page">
      <PageHeader />
      <div className="page-content">
        <CheckoutFormSkeleton />
        <div className="page-divider" />
        <SummarySkeleton />
      </div>
    </div>
  </div>
);
