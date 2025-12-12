import { Suspense } from "react";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";
import { CartNavItem } from "./components/CartNavItem";
import { CategoryNavContainer } from "./components/CategoryNavContainer";
import { MobileCategoryNavContainer } from "./components/MobileCategoryNavContainer";
import { MobileMenu } from "./components/MobileMenu";
import { SearchBar } from "./components/SearchBar";

export const Nav = ({ channel }: { channel: string }) => {
	return (
		<nav className="flex w-full gap-4 lg:gap-6" aria-label="Main navigation">
			{/* Desktop Category Navigation */}
			<ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-6 lg:px-0">
				<Suspense fallback={<li className="text-sm text-secondary-400">Loading categories...</li>}>
					<CategoryNavContainer />
				</Suspense>
			</ul>

			{/* Right side: Search, User, Cart */}
			<div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-6">
				<div className="hidden lg:flex">
					<SearchBar channel={channel} />
				</div>
				<Suspense fallback={<div className="w-8" />}>
					<UserMenuContainer />
				</Suspense>
			</div>
			<div className="flex items-center">
				<Suspense fallback={<div className="w-6" />}>
					<CartNavItem channel={channel} />
				</Suspense>
			</div>

			{/* Mobile Menu */}
			<Suspense>
				<MobileMenu>
					<SearchBar channel={channel} />
					<Suspense fallback={<li className="py-3 text-secondary-400">Loading categories...</li>}>
						<MobileCategoryNavContainer />
					</Suspense>
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
