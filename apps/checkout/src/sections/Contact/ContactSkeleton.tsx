import { Skeleton } from "@/components/Skeleton";
import React from "react";

interface ContactSkeletonProps {}

export const ContactSkeleton: React.FC<ContactSkeletonProps> = ({}) => {
  return (
    <div>
      <Skeleton variant="title" />
      <div className="flex flex-row justify-between">
        <Skeleton className="w-1/2" />
        <Skeleton className="w-1/8" />
      </div>
    </div>
  );
};
