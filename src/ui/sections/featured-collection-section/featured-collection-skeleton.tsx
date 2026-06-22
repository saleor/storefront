import { cn } from "@/lib/utils";
import { ProductsGridSkeleton } from "@/ui/components/plp/products-grid-skeleton";

interface FeaturedCollectionSkeletonProps {
	heading?: string;
	className?: string;
	limit?: number;
}

export function FeaturedCollectionSkeleton({
	heading,
	className,
	limit = 8,
}: FeaturedCollectionSkeletonProps) {
	return (
		<section
			className={cn("bg-background", className)}
			aria-busy="true"
			aria-label="Loading featured products"
		>
			<div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
				{heading ? <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" aria-hidden="true" /> : null}
			</div>
			<ProductsGridSkeleton className="pt-0" desktopColumns={4} itemCount={limit} />
		</section>
	);
}
