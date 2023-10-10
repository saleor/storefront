import React from "react";
import { Skeleton } from "@/checkout/components";

interface PaymentSectionSkeletonProps {}

export const PaymentSectionSkeleton: React.FC<PaymentSectionSkeletonProps> = ({}) => {
	return (
		<div className="py-6">
			<Skeleton variant="title" />
			<div className="mt-4 flex flex-row items-center rounded border border-gray-200 px-6 pb-4 pt-6">
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="w-1/5" />
			</div>
		</div>
	);
};
