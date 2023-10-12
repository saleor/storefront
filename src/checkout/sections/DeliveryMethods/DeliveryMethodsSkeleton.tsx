import React from "react";
import { Skeleton } from "@/checkout/components";

export const DeliveryMethodsSkeleton = () => {
	return (
		<div className="py-6">
			<Skeleton variant="title" className="w-1/3" />
			<div className="rounded border border-neutral-200 px-6 pb-4 pt-6">
				<Skeleton className="w-2/3" />
				<Skeleton className="w-1/3" />
			</div>
			<Skeleton className="mt-6 w-3/4" />
		</div>
	);
};
