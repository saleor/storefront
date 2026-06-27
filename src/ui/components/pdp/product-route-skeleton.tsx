import { cn } from "@/lib/utils";
import { PDP_GALLERY_LAYOUT, PDP_LAYOUT_CLASSES } from "./gallery-layout";
import { GallerySkeleton } from "./variant-gallery-dynamic";
import { VariantSectionSkeleton } from "./variant-section-dynamic";

interface ProductRouteSkeletonProps {
	/**
	 * Where the skeleton renders:
	 * - `"route"`: route `loading.tsx` during client navigations.
	 * - `"page"`: page-level Suspense fallback while `ProductShell` resolves.
	 *
	 * Shown immediately (no fade delay) so 16.3 instant navigations surface a shell on click.
	 */
	surface?: "route" | "page";
}

function BreadcrumbSkeleton() {
	return (
		<div className="mb-6 hidden sm:block">
			<div className="flex items-center gap-2">
				<div className="h-4 w-12 animate-pulse rounded bg-muted" />
				<div className="h-4 w-4 animate-pulse rounded bg-muted" />
				<div className="h-4 w-20 animate-pulse rounded bg-muted" />
				<div className="h-4 w-4 animate-pulse rounded bg-muted" />
				<div className="h-4 w-32 animate-pulse rounded bg-muted" />
			</div>
		</div>
	);
}

function AttributesAccordionSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("space-y-0", className)}>
			{[...Array(3)].map((_, i) => (
				<div key={i} className="border-b border-border py-4">
					<div className="h-5 w-32 animate-pulse rounded bg-muted" />
				</div>
			))}
		</div>
	);
}

/**
 * Shared PDP skeleton for route `loading.tsx` and the page-level Suspense fallback.
 * Driven by {@link PDP_GALLERY_LAYOUT} so shell, island, and route loaders stay aligned.
 *
 * Renders its own `<main>` to mirror the live `ProductShell` structure (the layout's
 * outer `<main className="flex-1">` wrapping is a pre-existing, app-wide pattern).
 */
export function ProductRouteSkeleton({ surface = "page" }: ProductRouteSkeletonProps) {
	const layout = PDP_LAYOUT_CLASSES[PDP_GALLERY_LAYOUT];

	const wrapperClassName = surface === "page" ? "flex min-h-screen flex-col bg-background" : undefined;

	return (
		<div role="status" aria-busy="true" aria-label="Loading product" className={wrapperClassName}>
			<main className={cn(layout.main, surface === "route" && "flex-1")}>
				<BreadcrumbSkeleton />
				<div className={layout.grid}>
					<div className={layout.galleryColumn}>
						<GallerySkeleton />
					</div>

					<div className={layout.infoColumn}>
						<div className="order-2 h-10 w-3/4 max-w-md animate-pulse rounded bg-muted" />
						<VariantSectionSkeleton />
						{layout.attributesPlacement === "info" && (
							<div className="order-4 mt-6">
								<AttributesAccordionSkeleton />
							</div>
						)}
					</div>

					{layout.attributesPlacement === "gallery" && layout.attributesGalleryBlock && (
						<div className={layout.attributesGalleryBlock}>
							<AttributesAccordionSkeleton />
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
