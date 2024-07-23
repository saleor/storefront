import { Divider, Skeleton } from "@/checkout/components";

export const SummarySkeleton = () => (
	<div className="summary px-6 pt-6">
		<div className="flex flex-col lg:hidden">
			<div className="mb-6 flex flex-row items-center justify-between">
				<Skeleton className="w-1/3" />
				<Skeleton className="w-1/4" />
			</div>
			<Skeleton className="block h-8 w-5/12 sm:hidden" />
		</div>
		<div className="hidden sm:block">
			<div className="static mb-8 flex h-24 flex-row  items-center justify-between">
				<div className="flex flex-col flex-wrap self-stretch">
					<Skeleton className="h-18 w-18 mr-4" />
					<Skeleton className="w-22 mb-4" />
					<Skeleton className="w-18 mb-4" />
					<Skeleton className="w-12" />
				</div>
				<div className="justify center flex flex-col items-end">
					<Skeleton className="w-22 mb-4" />
					<Skeleton className="w-18 mb-4" />
				</div>
			</div>
			<div className="static mb-4 flex h-24 flex-row  items-center justify-between">
				<div className="flex flex-col flex-wrap self-stretch">
					<Skeleton className="h-18 w-18 mr-4" />
					<Skeleton className="w-22 mb-4" />
					<Skeleton className="w-18 mb-4" />
				</div>
				<div className="justify center flex flex-col items-end">
					<Skeleton className="w-22 mb-4" />
					<Skeleton className="w-18" />
				</div>
			</div>
			<Skeleton className="mb-4 h-6" />
			<Divider className="bg-neutral-100" />
			<div className="flex flex-col">
				<div className="mt-6 flex flex-row items-center justify-between">
					<Skeleton className="w-22" />
					<Skeleton className="w-18" />
				</div>
				<div className="my-6 flex flex-row items-center justify-between">
					<Skeleton className="w-16" />
					<Skeleton className="w-14" />
				</div>
				<div className="mb-6 flex flex-row items-center justify-between">
					<Skeleton className="w-19" />
					<Skeleton className="w-10" />
				</div>
				<Divider className="bg-neutral-100" />
				<div className="my-6 flex flex-row items-center justify-between">
					<Skeleton className="w-14" />
					<Skeleton className="w-12" />
				</div>
			</div>
		</div>
	</div>
);
