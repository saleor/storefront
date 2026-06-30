import { ProductsGridSkeleton } from "./products-grid-skeleton";

/**
 * Full PLP route skeleton (hero + grid) for category/collection loading.tsx
 * and the page-level Suspense fallback. The hero block mirrors `CategoryHero`
 * (`h-[340px]`, content bottom-aligned: breadcrumbs + h1 + description) so a
 * cold-cache paint doesn't shift when the real hero resolves. Uses delayed
 * visibility to avoid flash on fast cached loads.
 */
export function PlpPageLoading() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<section className="relative h-[340px] overflow-hidden border-b border-border bg-muted">
				<div className="container-content relative flex h-full flex-col justify-end pb-10">
					<div className="mb-4 flex items-center gap-2" aria-hidden="true">
						<div className="h-3 w-12 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-3 w-3 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-3 w-20 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-3 w-3 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/10" />
					</div>
					<div className="h-9 w-64 max-w-full animate-pulse rounded bg-muted-foreground/10" />
					<div className="mt-5 h-5 w-96 max-w-full animate-pulse rounded bg-muted-foreground/10" />
				</div>
			</section>
			<ProductsGridSkeleton />
		</div>
	);
}
