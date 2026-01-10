/**
 * Product list skeleton - fallback for cache misses
 */
export default function ProductsLoading() {
	return (
		<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
			<div className="mb-8">
				<div className="h-8 w-48 animate-pulse rounded bg-muted" />
			</div>

			<div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
				{[...Array(8)].map((_, i) => (
					<div key={i} className="space-y-3">
						<div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
						<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
						<div className="h-4 w-16 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>
		</main>
	);
}
