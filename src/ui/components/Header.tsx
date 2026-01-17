import { Suspense } from "react";
import { Logo } from "./logo";
import { NavLinks } from "./nav/components/nav-links";
import { CartNavItem } from "./nav/components/cart-nav-item";
import { UserMenuContainer } from "./nav/components/user-menu/user-menu-container";
import { MobileMenu } from "./nav/components/mobile-menu";
import { SearchBar } from "./nav/components/search-bar";

export async function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					{/* Logo */}
					<Logo />

					{/* Search bar - centered on desktop */}
					<div className="hidden flex-1 justify-center md:flex">
						<SearchBar channel={channel} />
					</div>

					{/* Navigation - Desktop */}
					<nav className="hidden items-center gap-6 lg:flex">
						<NavLinks channel={channel} />
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
								<SearchBar channel={channel} />
								<NavLinks channel={channel} />
							</MobileMenu>
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
