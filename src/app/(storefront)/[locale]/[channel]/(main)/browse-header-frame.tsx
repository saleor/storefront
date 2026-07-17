import { Suspense } from "react";
import { Logo } from "@/ui/components/logo";
import { Logo as SharedLogo } from "@/ui/components/shared/logo";
import { UserMenuSkeleton } from "@/ui/components/nav/components/user-menu/user-menu-container";
import {
	HeaderActionsSlot,
	HeaderMobileMenuSlot,
	HeaderNavSlot,
	HeaderSearchSlot,
	type BrowseRouteParams,
} from "./browse-chrome-slots";

function HeaderActionsSkeleton() {
	return (
		<>
			<UserMenuSkeleton />
			<div className="h-10 w-10" aria-hidden="true" />
		</>
	);
}

function HeaderLogoFallback() {
	return (
		<div className="flex shrink-0 items-center" aria-hidden="true">
			<SharedLogo className="h-7 w-auto" />
		</div>
	);
}

export function BrowseHeaderFrame({ params }: { params: BrowseRouteParams }) {
	return (
		<header
			id="storefront-header"
			className="relative sticky top-0 z-40 border-b border-border bg-background"
		>
			<div className="container-nav">
				<div className="flex h-16 items-center justify-between gap-4">
					<Suspense fallback={<HeaderLogoFallback />}>
						<Logo />
					</Suspense>

					<Suspense
						fallback={
							<nav className="hidden flex-1 justify-center lg:ml-10 lg:flex xl:ml-14" aria-hidden="true">
								<div className="h-4 w-48 animate-pulse rounded bg-secondary" />
							</nav>
						}
					>
						<HeaderNavSlot params={params} />
					</Suspense>

					<Suspense
						fallback={
							<div
								className="hidden md:flex md:max-w-md md:flex-1 md:justify-end lg:flex-none"
								aria-hidden="true"
							>
								<div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-secondary" />
							</div>
						}
					>
						<HeaderSearchSlot params={params} />
					</Suspense>

					<div className="flex items-center gap-1">
						<Suspense fallback={<HeaderActionsSkeleton />}>
							<HeaderActionsSlot params={params} />
						</Suspense>
						<Suspense fallback={null}>
							<HeaderMobileMenuSlot params={params} />
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
