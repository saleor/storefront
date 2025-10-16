import { ProductListSkeleton } from "@/ui/atoms/SkeletonLoader";

export default function Loading() {
	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<div className="mb-8 h-8 w-64 animate-pulse rounded bg-base-800" />
			<ProductListSkeleton />
		</div>
	);
}
