import { type ReactNode, Suspense } from "react";
import { siteChrome } from "@/config/site-chrome";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { Logo } from "@/ui/components/shared/logo";
import { AnnouncementBar } from "@/ui/sections/announcement-bar/announcement-bar";

function HeaderSkeleton() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
			<div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					<div className="col-span-2 md:col-span-1">
						<div className="bg-background/20 mb-4 h-7 w-24 animate-pulse rounded" />
						<div className="mt-4 space-y-2">
							<div className="bg-background/20 h-4 w-full max-w-xs animate-pulse rounded" />
							<div className="bg-background/20 h-4 w-3/4 max-w-xs animate-pulse rounded" />
						</div>
					</div>
					{[1, 2, 3].map((i) => (
						<div key={i} className="hidden md:block">
							<div className="bg-background/20 mb-4 h-4 w-20 animate-pulse rounded" />
							<div className="space-y-3">
								{[1, 2, 3, 4].map((j) => (
									<div key={j} className="bg-background/20 h-4 w-24 animate-pulse rounded" />
								))}
							</div>
						</div>
					))}
				</div>
				{/* Bottom bar */}
				<div className="mt-12 flex items-center justify-between border-t border-inverse pt-8">
					<div className="bg-background/20 h-3 w-32 animate-pulse rounded" />
					<div className="flex gap-6">
						<div className="bg-background/20 h-3 w-20 animate-pulse rounded" />
						<div className="bg-background/20 h-3 w-24 animate-pulse rounded" />
					</div>
				</div>
			</div>
		</footer>
	);
}

/** Header + page + footer shell. User menu auth syncs via `HeaderAuthRefresh` (refresh on nav, revalidate when tab refocuses). */
export function MainChrome({ channel, children }: { channel: string; children: ReactNode }) {
	const { announcementBar } = siteChrome;

	return (
		<>
			<AnnouncementBar
				id={announcementBar.id}
				message={announcementBar.message}
				href={announcementBar.href}
				linkLabel={announcementBar.linkLabel}
				dismissible={announcementBar.dismissible}
			/>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header channel={channel} />
			</Suspense>
			<div className="flex min-h-[calc(100dvh-64px)] flex-col">
				<main className="flex-1">{children}</main>
				<Suspense fallback={<FooterSkeleton />}>
					<Footer channel={channel} />
				</Suspense>
			</div>
		</>
	);
}
