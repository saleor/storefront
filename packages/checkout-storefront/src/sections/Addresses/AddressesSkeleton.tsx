import { Skeleton } from "@/checkout-storefront/components/Skeleton";
import React from "react";

export const AddressesSkeleton: React.FC = () => {
  return (
    <div className="my-12">
      <Skeleton variant="title" className="w-1/3" />
      <div className="skeleton-box">
        <Skeleton className="w-1/3" />
        <Skeleton className="w-2/3" />
        <Skeleton className="w-1/2" />
        <Skeleton className="w-4/5" />
        <Skeleton className="w-1/5" />
      </div>
      <Skeleton className="mt-6 w-3/4" />
    </div>
  );
};
