export function ProductSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
			<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
				{/* Image skeleton */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<div className="relative aspect-square animate-pulse overflow-hidden rounded-lg bg-base-800" />
				</div>

				{/* Content skeleton */}
				<div className="flex flex-col space-y-6">
					{/* Title skeleton */}
					<div className="space-y-3">
						<div className="h-10 w-3/4 animate-pulse rounded bg-base-800" />
						<div className="h-8 w-32 animate-pulse rounded bg-base-800" />
					</div>

					{/* Variant selector skeleton */}
					<div className="space-y-3">
						<div className="h-6 w-24 animate-pulse rounded bg-base-800" />
						<div className="flex gap-2">
							<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
							<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
							<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
						</div>
					</div>

					{/* Button skeleton */}
					<div className="h-12 w-full animate-pulse rounded bg-base-800" />

					{/* Description skeleton */}
					<div className="space-y-3 border-t border-base-800 pt-8">
						<div className="h-6 w-40 animate-pulse rounded bg-base-800" />
						<div className="h-4 w-full animate-pulse rounded bg-base-800" />
						<div className="h-4 w-full animate-pulse rounded bg-base-800" />
						<div className="h-4 w-3/4 animate-pulse rounded bg-base-800" />
					</div>
				</div>
			</div>
		</section>
	);
}

export function ProductListSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="group">
					<div className="relative mb-4 aspect-square animate-pulse overflow-hidden rounded-lg bg-base-800" />
					<div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-base-800" />
					<div className="h-4 w-24 animate-pulse rounded bg-base-800" />
				</div>
			))}
		</div>
	);
}

export function ProductDetailsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<div className="h-10 w-3/4 animate-pulse rounded bg-base-800" />
				<div className="h-8 w-32 animate-pulse rounded bg-base-800" />
			</div>
			<div className="space-y-3">
				<div className="h-6 w-24 animate-pulse rounded bg-base-800" />
				<div className="flex gap-2">
					<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
					<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
					<div className="h-10 w-20 animate-pulse rounded bg-base-800" />
				</div>
			</div>
			<div className="h-12 w-full animate-pulse rounded bg-base-800" />
		</div>
	);
}
