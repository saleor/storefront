import React from "react";
import { Skeleton } from "@/checkout/components";

export const AddressSkeleton = () => {
	return (
		<div className="mb-2 rounded border border-gray-200 px-6 pb-4 pt-6" data-testid="addressSkeleton">
			<Skeleton className="w-1/3" />
			<Skeleton className="w-2/3" />
			<Skeleton className="w-1/2" />
			<Skeleton className="w-4/5" />
			<Skeleton className="w-1/5" />
		</div>
	);
};
