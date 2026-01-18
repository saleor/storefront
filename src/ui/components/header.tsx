import { Suspense } from "react";
import { Logo } from "./logo";
import { NavLinks } from "./nav/components/nav-links";
import { CartNavItem } from "./nav/components/cart-nav-item";
import { UserMenuContainer } from "./nav/components/user-menu/user-menu-container";
import { MobileMenu } from "./nav/components/mobile-menu";
import { SearchBar } from "./nav/components/search-bar";

function SearchBarSkeleton() {
	return <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-secondary" />;
}

function NavLinksSkeleton() {
	return (
		<>
			<li className="inline-flex">
				<span className="h-4 w-8 animate-pulse rounded bg-muted" />
			</li>
			<li className="inline-flex">
				<span className="h-4 w-16 animate-pulse rounded bg-muted" />
			</li>
			<li className="inline-flex">
				<span className="h-4 w-12 animate-pulse rounded bg-muted" />
			</li>
		</>
	);
}

export async function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					{/* Logo - no Suspense needed (simple server component) */}
					<Logo />

					{/* Search bar - Suspense for server action */}
					<div className="hidden flex-1 justify-center md:flex">
						<Suspense fallback={<SearchBarSkeleton />}>
							<SearchBar channel={channel} />
						</Suspense>
					</div>

					{/* Navigation - Suspense for cached data + client active state */}
					<nav className="hidden items-center gap-6 lg:flex">
						<Suspense fallback={<NavLinksSkeleton />}>
							<NavLinks channel={channel} />
						</Suspense>
					</nav>

					{/* Actions */}
					<div className="flex items-center gap-1">
						<Suspense fallback={<div className="h-10 w-10" />}>
							<UserMenuContainer />
						</Suspense>
						<Suspense fallback={<div className="h-10 w-10" />}>
							<CartNavItem channel={channel} />
						</Suspense>
						<Suspense>
							<MobileMenu>
								<Suspense fallback={<SearchBarSkeleton />}>
									<SearchBar channel={channel} />
								</Suspense>
								<Suspense fallback={<NavLinksSkeleton />}>
									<NavLinks channel={channel} />
								</Suspense>
							</MobileMenu>
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
