import { Skeleton } from "@/checkout-storefront/components";
import React from "react";

export const AddressSkeleton = () => {
  return (
    <div className="skeleton-box mb-2">
      <Skeleton className="w-1/3" />
      <Skeleton className="w-2/3" />
      <Skeleton className="w-1/2" />
      <Skeleton className="w-4/5" />
      <Skeleton className="w-1/5" />
    </div>
  );
};
