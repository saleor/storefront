import { Skeleton } from "@/checkout/components";

export const PaymentSectionSkeleton = () => {
	return (
		<div className="py-6">
			<Skeleton variant="title" />
			<div className="mt-4 flex flex-row items-center rounded border border-neutral-200 px-6 pb-4 pt-6">
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="mr-4 w-1/5" />
				<Skeleton className="w-1/5" />
			</div>
		</div>
	);
};
