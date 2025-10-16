export default function Loading() {
	return (
		<section className="mx-auto max-w-7xl px-6 py-12 lg:px-12" role="status" aria-live="polite" aria-label="Loading product">
			<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
				<div className="aspect-square bg-gradient-to-br from-base-800 to-base-900 rounded relative overflow-hidden animate-scale-in">
					<div className="absolute inset-0 animate-shimmer"></div>
				</div>
				<div className="flex flex-col space-y-6 animate-slide-up-fade">
					<div className="space-y-3">
						<div className="h-12 bg-gradient-to-r from-base-800 to-base-700 rounded w-3/4 relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
						<div className="h-8 bg-gradient-to-r from-base-800 to-base-700 rounded w-1/3 relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
					</div>
					<div className="space-y-3 pt-4">
						<div className="h-4 bg-gradient-to-r from-base-800 to-base-700 rounded w-full relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
						<div className="h-4 bg-gradient-to-r from-base-800 to-base-700 rounded w-full relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
						<div className="h-4 bg-gradient-to-r from-base-800 to-base-700 rounded w-2/3 relative overflow-hidden">
							<div className="absolute inset-0 animate-shimmer"></div>
						</div>
					</div>
					<div className="h-14 bg-gradient-to-r from-base-800 to-base-700 rounded relative overflow-hidden">
						<div className="absolute inset-0 animate-shimmer"></div>
					</div>
				</div>
			</div>
			<span className="sr-only">Loading product details...</span>
		</section>
	);
}
