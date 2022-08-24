import { Skeleton } from "@/checkout-storefront/components";
import React from "react";

export const DeliveryMethodsSkeleton = () => {
  return (
    <div className="section">
      <Skeleton variant="title" className="w-1/3" />
      <div className="skeleton-box">
        <Skeleton className="w-2/3" />
        <Skeleton className="w-1/3" />
      </div>
      <Skeleton className="mt-6 w-3/4" />
    </div>
  );
};
