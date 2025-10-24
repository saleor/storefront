export default function Loading() {
	return (
		<div className="mx-auto max-w-7xl px-6 py-12 lg:px-12" role="status" aria-live="polite" aria-label="Loading">
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="card overflow-hidden relative stagger-item">
						<div className="aspect-square bg-gradient-to-br from-base-800 to-base-900 mb-4 relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
						<div className="space-y-3">
							<div className="h-4 bg-gradient-to-r from-base-800 to-base-700 rounded w-3/4 relative overflow-hidden">
								<div className="absolute inset-0 animate-shimmer"></div>
							</div>
							<div className="h-3 bg-gradient-to-r from-base-800 to-base-700 rounded w-1/2 relative overflow-hidden">
								<div className="absolute inset-0 animate-shimmer"></div>
							</div>
						</div>
					</div>
				))}
			</div>
			<span className="sr-only">Loading products...</span>
		</div>
	);
}
