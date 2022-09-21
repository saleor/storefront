import { CheckoutFormSkeleton } from "@/checkout-storefront/sections/CheckoutForm";
import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { SummarySkeleton } from "@/checkout-storefront/sections/Summary";

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
