import { type ReactNode, Suspense } from "react";
import { Footer } from "@/ui/components/footer";
import { BrowseHeaderFrame } from "./browse-header-frame";
import { ScrollToTopOnNavigate } from "@/ui/components/shared/scroll-to-top-on-navigate";
import { AnnouncementBarSkeleton } from "@/ui/sections/announcement-bar/announcement-bar";
import { AnnouncementBarSlot, type BrowseRouteParams } from "./browse-chrome-slots";

function FooterSkeleton() {
	return (
		<footer className="animate-skeleton-delayed bg-foreground text-background opacity-0">
			<div className="container-content pb-24 pt-12 sm:pb-12 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					<div className="col-span-2 md:col-span-1">
						<div className="mb-4 h-7 w-24 animate-pulse rounded bg-background/20" />
						<div className="mt-4 space-y-2">
							<div className="h-4 w-full max-w-xs animate-pulse rounded bg-background/20" />
							<div className="h-4 w-3/4 max-w-xs animate-pulse rounded bg-background/20" />
						</div>
					</div>
					{[1, 2, 3].map((i) => (
						<div key={i} className="hidden md:block">
							<div className="mb-4 h-4 w-20 animate-pulse rounded bg-background/20" />
							<div className="space-y-3">
								{[1, 2, 3, 4].map((j) => (
									<div key={j} className="h-4 w-24 animate-pulse rounded bg-background/20" />
								))}
							</div>
						</div>
					))}
				</div>
				<div className="mt-12 flex items-center justify-between border-t border-inverse pt-8">
					<div className="h-3 w-32 animate-pulse rounded bg-background/20" />
					<div className="flex gap-6">
						<div className="h-3 w-20 animate-pulse rounded bg-background/20" />
						<div className="h-3 w-24 animate-pulse rounded bg-background/20" />
					</div>
				</div>
			</div>
		</footer>
	);
}

async function FooterSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	return <Footer locale={locale} channel={channel} />;
}

/**
 * Sync browse chrome — header, announcement, and footer each stream in their own
 * Suspense boundary; `<main>` is never gated on cached copy fetches.
 */
export function MainChrome({ params, children }: { params: BrowseRouteParams; children: ReactNode }) {
	return (
		<>
			{/* usePathname() is runtime-only in Next 16 — must stream inside Suspense for PPR */}
			<Suspense fallback={null}>
				<ScrollToTopOnNavigate />
			</Suspense>
			<Suspense fallback={<AnnouncementBarSkeleton />}>
				<AnnouncementBarSlot params={params} />
			</Suspense>
			<BrowseHeaderFrame params={params} />
			<div className="flex min-h-[calc(100dvh-var(--chrome-offset))] flex-col">
				<main className="flex-1">{children}</main>
				<Suspense fallback={<FooterSkeleton />}>
					<FooterSlot params={params} />
				</Suspense>
			</div>
		</>
	);
}
