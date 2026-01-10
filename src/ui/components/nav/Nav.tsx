import { Suspense } from "react";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { SearchBar } from "./components/SearchBar";

export const Nav = ({ channel }: { channel: string }) => {
	return (
		<nav className="flex flex-1 items-center gap-4 lg:gap-8" aria-label="Main navigation">
			{/* Search bar - centered on desktop */}
			<div className="hidden flex-1 justify-center lg:flex">
				<SearchBar channel={channel} />
			</div>

			{/* Navigation links - desktop */}
			<ul className="hidden items-center gap-6 md:flex">
				<NavLinks channel={channel} />
			</ul>

			{/* User menu and cart */}
			<div className="ml-auto flex items-center gap-4 md:ml-0">
				<Suspense fallback={<div className="h-8 w-8" />}>
					<UserMenuContainer />
				</Suspense>
				<Suspense fallback={<div className="h-8 w-8" />}>
					<CartNavItem channel={channel} />
				</Suspense>
			</div>

			{/* Mobile menu */}
			<Suspense>
				<MobileMenu>
					<SearchBar channel={channel} />
					<NavLinks channel={channel} />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
