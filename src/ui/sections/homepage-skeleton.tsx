import { FeaturedCollectionSkeleton } from "@/ui/sections/featured-collection-section/featured-collection-skeleton";

/**
 * Shared homepage skeleton for route `loading.tsx` and the page-level Suspense fallback.
 * Mirrors the live section stack (hero → featured collection) so navigations land without CLS.
 *
 * The hero block targets the `MediaHero` `fold` height (`100svh - --chrome-offset`, the
 * default shop config when `hero.backgroundImage` is set) with bottom-aligned copy, so a
 * cold-cache paint matches the real cover image. A shop rendering `EditorialHero` instead
 * (no hero image) is shorter, so its cold-cache paint shifts slightly upward — an inherent
 * trade-off since the hero variant is chosen by cached content that isn't available until
 * the shell resolves. Only shown on a cache miss; warm PPR serves the prerendered shell.
 */
export function HomepageSkeleton() {
	return (
		<div role="status" aria-busy="true" aria-label="Loading homepage">
			{/* Hero — mirrors MediaHero `fold` height + bottom-aligned copy rhythm */}
			<section className="relative isolate flex min-h-[calc(100svh-var(--chrome-offset))] flex-col overflow-hidden border-b border-border bg-muted">
				<div className="flex flex-1 items-end px-4 pb-section-md pt-4 sm:px-6 lg:pb-section-lg lg:pl-8 lg:pr-12 xl:pl-16">
					<div className="mx-auto w-full max-w-xl space-y-5 lg:mx-0">
						<div className="h-4 w-32 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-12 w-3/4 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-5 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
						<div className="h-11 w-40 animate-pulse rounded-button bg-muted-foreground/10" />
					</div>
				</div>
			</section>
			<FeaturedCollectionSkeleton limit={4} />
		</div>
	);
}
