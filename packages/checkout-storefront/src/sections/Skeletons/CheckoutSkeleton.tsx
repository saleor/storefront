import { CheckoutFormSkeleton } from "./CheckoutFormSkeleton";
import { SummarySkeleton } from "./SummarySkeleton";

export const CheckoutSkeleton = () => (
  <div className="app">
    <div className="page">
      <div className="page-content">
        <CheckoutFormSkeleton />
        <div className="page-divider" />
        <SummarySkeleton />
      </div>
    </div>
  </div>
);
