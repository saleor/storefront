/**
 * Product page skeleton - fallback for cache misses
 * Won't show if page is cached/prefetched (most cases)
 */
export default function ProductLoading() {
	return (
		<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
			{/* Breadcrumb skeleton - hidden on mobile */}
			<div className="mb-6 hidden sm:block">
				<div className="flex items-center gap-2">
					<div className="h-4 w-12 animate-pulse rounded bg-muted" />
					<div className="h-4 w-4 animate-pulse rounded bg-muted" />
					<div className="h-4 w-20 animate-pulse rounded bg-muted" />
					<div className="h-4 w-4 animate-pulse rounded bg-muted" />
					<div className="h-4 w-32 animate-pulse rounded bg-muted" />
				</div>
			</div>

			{/* Product Grid */}
			<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
				{/* Gallery skeleton */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<div className="flex flex-col gap-4">
						<div className="aspect-[4/5] w-full animate-pulse rounded-lg bg-muted" />
						<div className="hidden gap-2 sm:flex">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-20 w-20 animate-pulse rounded-md bg-muted" />
							))}
						</div>
						<div className="flex justify-center gap-1.5 sm:hidden">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-2 w-2 animate-pulse rounded-full bg-muted" />
							))}
						</div>
					</div>
				</div>

				{/* Product Info skeleton */}
				<div className="space-y-8">
					<div className="space-y-3">
						<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
					</div>

					<div className="space-y-6 py-2">
						<div className="space-y-3">
							<div className="h-4 w-16 animate-pulse rounded bg-muted" />
							<div className="flex gap-2">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="h-12 w-12 animate-pulse rounded-full bg-muted" />
								))}
							</div>
						</div>
						<div className="space-y-3">
							<div className="h-4 w-12 animate-pulse rounded bg-muted" />
							<div className="flex gap-2">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="h-12 w-16 animate-pulse rounded-md bg-muted" />
								))}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="h-8 w-24 animate-pulse rounded bg-muted" />
						<div className="h-14 w-full animate-pulse rounded-md bg-muted" />
						<div className="flex justify-center gap-6 pt-2">
							<div className="h-4 w-28 animate-pulse rounded bg-muted" />
							<div className="h-4 w-36 animate-pulse rounded bg-muted" />
						</div>
					</div>

					<div className="space-y-0">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="border-b border-border py-4">
								<div className="h-5 w-32 animate-pulse rounded bg-muted" />
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
