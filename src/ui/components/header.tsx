import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getNavbarMenuItems } from "@/lib/menus/get-menu-data";
import { serializeMenuForNav } from "@/lib/menus/serialize-menu-for-nav";
import type { NavChromeContent } from "@/lib/content/types";
import { Logo } from "./logo";
import { NavLinksDesktop } from "./nav/components/nav-links-desktop";
import { MobileNavLinks } from "./nav/components/mobile-nav-links";
import { CartNavItem } from "./nav/components/cart-nav-item";
import { UserMenuContainer } from "./nav/components/user-menu/user-menu-container";
import { MobileMenu } from "./nav/components/mobile-menu";
import { SearchBar } from "./nav/components/search-bar";

export async function Header({
	locale,
	channel,
	nav,
}: {
	locale: string;
	channel: string;
	nav: NavChromeContent;
}) {
	const [navItems, tSearchBar] = await Promise.all([
		getNavbarMenuItems(channel, locale).then((items) => serializeMenuForNav(items ?? [])),
		getTranslations({ locale, namespace: "search.bar" }),
	]);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					<Logo />

					<div className="hidden flex-1 justify-center md:flex">
						<SearchBar
							locale={locale}
							channel={channel}
							placeholder={tSearchBar("placeholder")}
							srOnlyLabel={tSearchBar("srOnlyLabel")}
						/>
					</div>

					<nav className="hidden lg:flex" aria-label="Main">
						<NavLinksDesktop items={navItems} nav={nav} />
					</nav>

					<div className="flex items-center gap-1">
						<UserMenuContainer locale={locale} channel={channel} />
						<Suspense fallback={<div className="h-10 w-10" />}>
							<CartNavItem channel={channel} localeSlug={locale} />
						</Suspense>
						<Suspense>
							<MobileMenu>
								<li className="py-3">
									<SearchBar
										locale={locale}
										channel={channel}
										placeholder={tSearchBar("placeholder")}
										srOnlyLabel={tSearchBar("srOnlyLabel")}
									/>
								</li>
								<MobileNavLinks items={navItems} nav={nav} />
							</MobileMenu>
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
