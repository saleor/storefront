import { Suspense } from "react";
import { AccountLink } from "./components/AccountLink";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";

export const Nav = () => {
	return (
		<nav className="flex w-full gap-4 lg:gap-6" aria-label="Main navigation">
			<ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
				<NavLinks />
			</ul>
			<div className="ml-auto flex items-center justify-center whitespace-nowrap">
				<Suspense fallback={<div className="w-6" />}>
					<AccountLink />
				</Suspense>
			</div>
			<div className="flex items-center">
				<Suspense fallback={<div className="w-6" />}>
					<CartNavItem />
				</Suspense>
			</div>
			<Suspense>
				<MobileMenu>
					<NavLinks />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
