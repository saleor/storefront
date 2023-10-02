import React from "react";
import { Skeleton } from "@/checkout/components";

interface ContactSkeletonProps {}

export const ContactSkeleton: React.FC<ContactSkeletonProps> = ({}) => {
	return (
		<div className="py-6">
			<Skeleton variant="title" />
			<div className="flex flex-row justify-between">
				<Skeleton className="w-1/2" />
				<Skeleton className="w-1/8" />
			</div>
		</div>
	);
};
