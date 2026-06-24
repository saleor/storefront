import { ProductsGridSkeleton } from "./products-grid-skeleton";

/**
 * Full PLP route skeleton (hero + grid) for category/collection loading.tsx.
 * Uses delayed visibility to avoid flash on fast cached loads.
 */
export function PlpPageLoading() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<div className="bg-muted py-12">
				<div className="container-content">
					<div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/10" />
					<div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted-foreground/10" />
				</div>
			</div>
			<ProductsGridSkeleton />
		</div>
	);
}
