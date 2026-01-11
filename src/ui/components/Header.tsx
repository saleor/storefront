import { Suspense } from "react";
import { Logo } from "./Logo";
import { NavLinks } from "./nav/components/NavLinks";
import { CartNavItem } from "./nav/components/CartNavItem";
import { UserMenuContainer } from "./nav/components/UserMenu/UserMenuContainer";
import { MobileMenu } from "./nav/components/MobileMenu";
import { SearchBar } from "./nav/components/SearchBar";

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
