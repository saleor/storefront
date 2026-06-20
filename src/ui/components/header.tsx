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
	const [navItems, tSearchBar, tNavHeader] = await Promise.all([
		getNavbarMenuItems(channel, locale).then((items) => serializeMenuForNav(items ?? [])),
		getTranslations({ locale, namespace: "search.bar" }),
		getTranslations({ locale, namespace: "nav.header" }),
	]);

	return (
		<header
			id="storefront-header"
			className="relative sticky top-0 z-40 border-b border-border bg-background"
		>
			<div className="container-nav">
				<div className="flex h-16 items-center justify-between gap-4">
					<Logo />

					<nav
						className="hidden flex-1 justify-center lg:ml-10 lg:flex xl:ml-14"
						aria-label={tNavHeader("mainAriaLabel")}
					>
						<NavLinksDesktop items={navItems} nav={nav} />
					</nav>

					<div className="hidden md:flex md:max-w-md md:flex-1 md:justify-end lg:flex-none">
						<SearchBar
							locale={locale}
							channel={channel}
							placeholder={tSearchBar("placeholder")}
							srOnlyLabel={tSearchBar("srOnlyLabel")}
						/>
					</div>

					<div className="flex items-center gap-1">
						<UserMenuContainer locale={locale} channel={channel} />
						<Suspense fallback={<div className="h-10 w-10" />}>
							<CartNavItem channel={channel} localeSlug={locale} />
						</Suspense>
						<Suspense>
							<MobileMenu>
								<MobileNavLinks items={navItems} nav={nav} />
								<li className="py-3">
									<SearchBar
										locale={locale}
										channel={channel}
										placeholder={tSearchBar("placeholder")}
										srOnlyLabel={tSearchBar("srOnlyLabel")}
									/>
								</li>
							</MobileMenu>
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
