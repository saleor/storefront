/**
 * Skeleton matching ProductList grid layout (homepage featured products).
 */
export function FeaturedProductsSkeleton() {
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{Array.from({ length: 12 }).map((_, i) => (
				<li key={i} className="animate-pulse">
					<div className="aspect-square overflow-hidden bg-secondary" />
					<div className="mt-2 flex justify-between">
						<div>
							<div className="mt-1 h-4 w-32 rounded bg-secondary" />
							<div className="mt-1 h-4 w-20 rounded bg-secondary" />
						</div>
						<div className="mt-1 h-4 w-16 rounded bg-secondary" />
					</div>
				</li>
			))}
		</ul>
	);
}
