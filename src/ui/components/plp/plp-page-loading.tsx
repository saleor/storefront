import { ProductsGridSkeleton } from "./products-grid-skeleton";

/**
 * Full PLP route skeleton (hero + grid) for category/collection loading.tsx.
 * Uses delayed visibility to avoid flash on fast cached loads.
 */
export function PlpPageLoading() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<div className="bg-muted px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="bg-muted-foreground/10 h-8 w-48 animate-pulse rounded" />
					<div className="bg-muted-foreground/10 mt-3 h-4 w-96 max-w-full animate-pulse rounded" />
				</div>
			</div>
			<ProductsGridSkeleton />
		</div>
	);
}
