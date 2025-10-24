import { Suspense } from "react";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { SearchBar } from "./components/SearchBar";

export const Nav = () => {
	return (
		<nav className="flex w-full gap-4 lg:gap-6" aria-label="Main navigation" id="primary-navigation">
			<ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
				<Suspense
					fallback={
						<div className="flex gap-4 lg:gap-8">
							<div className="h-6 w-20 animate-pulse rounded bg-base-800" />
							<div className="h-6 w-20 animate-pulse rounded bg-base-800" />
						</div>
					}
				>
					<NavLinks isMobile={false} />
				</Suspense>
			</ul>
			<div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8">
				<div className="hidden lg:flex">
					<Suspense fallback={<div className="h-10 w-80 animate-pulse rounded bg-base-800" />}>
						<SearchBar />
					</Suspense>
				</div>
				<Suspense fallback={<div className="w-8" />}>
					<UserMenuContainer />
				</Suspense>
			</div>
			<div className="flex items-center">
				<Suspense fallback={<div className="w-6" />}>
					<CartNavItem />
				</Suspense>
			</div>
			<Suspense>
				<MobileMenu>
					<Suspense fallback={<div className="h-10 w-full animate-pulse rounded bg-base-800" />}>
						<SearchBar />
					</Suspense>
					<Suspense
						fallback={
							<div className="space-y-2">
								<div className="h-6 w-full animate-pulse rounded bg-base-800" />
								<div className="h-6 w-full animate-pulse rounded bg-base-800" />
							</div>
						}
					>
						<NavLinks isMobile={true} />
					</Suspense>
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
