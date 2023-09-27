import React from "react";
import { AddressSkeleton } from "./AddressSkeleton";
import { Skeleton } from "@/checkout/src/components";

export const AddressSectionSkeleton = () => (
	<div className="px-4 pb-6 pt-5">
		<Skeleton variant="title" className="w-1/3" />
		<AddressSkeleton />
		<Skeleton className="mt-4 w-3/4" />
	</div>
);
