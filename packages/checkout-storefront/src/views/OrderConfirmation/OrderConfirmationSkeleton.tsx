import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { SummarySkeleton } from "@/checkout-storefront/sections/Summary/SummarySkeleton";
import { Skeleton } from "@/checkout-storefront/components/Skeleton";

export const OrderConfirmationSkeleton = () => {
  return (
    <div className="page">
      <header>
        <PageHeader />
        <Skeleton className="title h-4 w-72 mb-6" />
        <Skeleton />
        <Skeleton className="w-2/3" />
      </header>
      <main className="order-content overflow-hidden">
        <div className="skeleton-box w-1/2">
          <div className="mb-10">
            <Skeleton variant="title" />
            <Skeleton />
          </div>
          <div className="mb-10">
            <Skeleton variant="title" />
            <Skeleton className="w-2/3" />
          </div>
          <div className="mb-10">
            <Skeleton variant="title" />
            <Skeleton className="w-3/4" />
          </div>
          <div className="mb-10">
            <Skeleton variant="title" />
            <Skeleton className="w-1/2" />
            <Skeleton className="w-1/4" />
            <Skeleton className="w-2/3" />
          </div>
          <div className="mb-10">
            <Skeleton variant="title" />
            <Skeleton className="w-1/2" />
            <Skeleton className="w-1/4" />
            <Skeleton className="w-2/3" />
          </div>
        </div>
        <div className="order-divider" />
        <SummarySkeleton />
      </main>
    </div>
  );
};
