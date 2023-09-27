import React from "react";
import { Skeleton } from "@/checkout/src/components";

interface PaymentSectionSkeletonProps {}

export const PaymentSectionSkeleton: React.FC<PaymentSectionSkeletonProps> = ({}) => {
	return (
		<div className="section">
			<Skeleton variant="title" />
			<div className="skeleton-box mt-4 flex flex-row items-center">
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="w-1/5" />
			</div>
		</div>
	);
};
