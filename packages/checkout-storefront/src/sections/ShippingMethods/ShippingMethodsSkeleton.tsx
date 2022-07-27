import { Skeleton } from "@/checkout-storefront/components/Skeleton";
import React from "react";

interface ShippingMethodsSkeletonProps {}

export const ShippingMethodsSkeleton: React.FC<ShippingMethodsSkeletonProps> = ({}) => {
  return (
    <div className="my-12">
      <Skeleton variant="title" className="w-1/3" />
      <div className="skeleton-box">
        <Skeleton className="w-2/3" />
        <Skeleton className="w-1/3" />
      </div>
      <Skeleton className="mt-6 w-1/4" />
    </div>
  );
};
