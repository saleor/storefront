import { type ReactNode, Suspense } from "react";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { ScrollToTopOnNavigate } from "@/ui/components/shared/scroll-to-top-on-navigate";
import { Logo } from "@/ui/components/shared/logo";
import { AnnouncementBarSkeleton } from "@/ui/sections/announcement-bar/announcement-bar";
import { AnnouncementBarSlot, type BrowseRouteParams } from "./browse-chrome-slots";

function HeaderSkeleton() {
	return (
		<header
			id="storefront-header"
			className="relative sticky top-0 z-40 border-b border-border bg-background"
		>
			<div className="container-nav">
				<div className="flex h-16 items-center justify-between gap-4">
					<div className="flex shrink-0 items-center">
						<Logo className="h-7 w-auto" />
					</div>
					<div className="hidden flex-1 justify-center md:flex">
						<div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-secondary" />
					</div>
					<div className="flex items-center gap-1">
						<div className="h-10 w-10" />
						<div className="h-10 w-10" />
					</div>
				</div>
			</div>
		</header>
	);
}

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

async function HeaderSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	return <Header locale={locale} channel={channel} />;
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
			<Suspense fallback={null}>
				<ScrollToTopOnNavigate />
			</Suspense>
			<Suspense fallback={<AnnouncementBarSkeleton />}>
				<AnnouncementBarSlot params={params} />
			</Suspense>
			<Suspense fallback={<HeaderSkeleton />}>
				<HeaderSlot params={params} />
			</Suspense>
			<div className="flex min-h-[calc(100dvh-var(--chrome-offset))] flex-col">
				<main className="flex-1">{children}</main>
				<Suspense fallback={<FooterSkeleton />}>
					<FooterSlot params={params} />
				</Suspense>
			</div>
		</>
	);
}
