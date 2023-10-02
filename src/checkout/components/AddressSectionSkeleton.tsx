import React from "react";
import { AddressSkeleton } from "./AddressSkeleton";
import { Skeleton } from "@/checkout/components";

export const AddressSectionSkeleton = () => (
	<div className="py-6">
		<Skeleton variant="title" className="w-1/3" />
		<AddressSkeleton />
		<Skeleton className="mt-4 w-3/4" />
	</div>
);
