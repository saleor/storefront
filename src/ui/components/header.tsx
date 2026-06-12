import { Suspense } from "react";
import { getNavbarMenuItems } from "@/lib/menus/get-menu-data";
import { serializeMenuForNav } from "@/lib/menus/serialize-menu-for-nav";
import { Logo } from "./logo";
import { NavLinksDesktop } from "./nav/components/nav-links-desktop";
import { MobileNavLinks } from "./nav/components/mobile-nav-links";
import { CartNavItem } from "./nav/components/cart-nav-item";
import { UserMenuContainer } from "./nav/components/user-menu/user-menu-container";
import { MobileMenu } from "./nav/components/mobile-menu";
import { SearchBar } from "./nav/components/search-bar";

export async function Header({ locale, channel }: { locale: string; channel: string }) {
	const navItems = serializeMenuForNav((await getNavbarMenuItems(channel)) ?? []);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					<Logo />

					<div className="hidden flex-1 justify-center md:flex">
						<SearchBar locale={locale} channel={channel} />
					</div>

					<nav className="hidden lg:flex" aria-label="Main">
						<NavLinksDesktop items={navItems} />
					</nav>

					<div className="flex items-center gap-1">
						<UserMenuContainer locale={locale} channel={channel} />
						<Suspense fallback={<div className="h-10 w-10" />}>
							<CartNavItem channel={channel} />
						</Suspense>
						<Suspense>
							<MobileMenu>
								<li className="py-3">
									<SearchBar locale={locale} channel={channel} />
								</li>
								<MobileNavLinks items={navItems} />
							</MobileMenu>
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
