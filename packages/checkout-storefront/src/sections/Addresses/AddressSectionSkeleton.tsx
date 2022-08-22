import { Skeleton } from "@/checkout-storefront/components";
import { AddressSkeleton } from "./AddressSkeleton";
import React from "react";

export const AddressSectionSkeleton = () => (
  <div className="section">
    <Skeleton variant="title" className="w-1/3" />
    <AddressSkeleton />
    <Skeleton className="mt-4 w-3/4" />
  </div>
);
