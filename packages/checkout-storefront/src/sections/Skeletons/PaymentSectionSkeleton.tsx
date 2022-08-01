import { Divider } from "@/checkout-storefront/components/Divider";
import { Skeleton } from "@/checkout-storefront/components/Skeleton";
import React from "react";

interface PaymentSectionSkeletonProps {}

export const PaymentSectionSkeleton: React.FC<PaymentSectionSkeletonProps> = ({}) => {
  return (
    <div className="section">
      <Skeleton variant="title" />
      <div className="skeleton-box flex flex-row items-center mt-4">
        <Skeleton className="w-1/5 mr-4" />
        <Skeleton className="w-1/5 mr-4" />
        <Skeleton className="w-1/5" />
      </div>
    </div>
  );
};
