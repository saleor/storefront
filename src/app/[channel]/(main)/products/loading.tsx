/**
 * Product list skeleton - fallback for cache misses.
 *
 * Uses delayed visibility (500ms) to prevent flash on fast loads.
 * Only shows when there's a genuine wait (cold cache, slow connection).
 */
export default function ProductsLoading() {
	return (
		<main className="mx-auto w-full max-w-7xl flex-1 animate-skeleton-delayed-long px-4 py-4 opacity-0 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
			<div className="mb-8">
				<div className="h-8 w-48 animate-pulse rounded bg-muted" />
			</div>

			{/* Matches ProductGrid: grid-cols-2 lg:grid-cols-3 */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="space-y-3">
						{/* Matches ProductCard: aspect-[3/4] rounded-xl */}
						<div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-muted" />
						<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
						<div className="h-4 w-16 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>
		</main>
	);
}
