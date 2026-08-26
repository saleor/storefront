import { Suspense } from "react";
import { cookies } from "next/headers";
import { io } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getAnnouncementBarProps, getStorefrontContent } from "@/lib/content/server";
import { getNavbarMenuItems } from "@/lib/menus/get-menu-data";
import { serializeMenuForNav } from "@/lib/menus/serialize-menu-for-nav";
import { CartDrawerWrapper } from "@/ui/components/cart/cart-drawer-wrapper";
import { CartNavItem } from "@/ui/components/nav/components/cart-nav-item";
import { MobileMenu } from "@/ui/components/nav/components/mobile-menu";
import { MobileNavLinks } from "@/ui/components/nav/components/mobile-nav-links";
import { NavLinksDesktop } from "@/ui/components/nav/components/nav-links-desktop";
import { SearchBar } from "@/ui/components/nav/components/search-bar";
import { HeaderAuthRefresh } from "@/ui/components/nav/components/user-menu/header-auth-refresh";
import { UserMenuServer } from "@/ui/components/nav/components/user-menu/user-menu-server";
import { AnnouncementBar } from "@/ui/sections/announcement-bar/announcement-bar";
import { DismissibleAnnouncementBar } from "@/ui/sections/announcement-bar/announcement-bar-slot";

export type BrowseRouteParams = Promise<{ locale: string; channel: string }>;

/** Cached announcement copy + policy interpolation; nested Suspense for dismiss cookie. */
export async function AnnouncementBarSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	const announcement = await getAnnouncementBarProps(channel, locale);

	if (!announcement.message.trim()) {
		return null;
	}

	const props = {
		id: announcement.id,
		message: announcement.message,
		href: announcement.href,
		linkLabel: announcement.linkLabel,
		dismissible: announcement.dismissible,
	};

	if (!props.dismissible) {
		return <AnnouncementBar {...props} />;
	}

	return (
		<Suspense fallback={<AnnouncementBar {...props} />}>
			<DismissibleAnnouncementBar {...props} />
		</Suspense>
	);
}

/**
 * Cart drawer surface copy (cached) + live checkout (cookies).
 * `getStorefrontContent` is also called in Header/Footer/getAnnouncementBarProps — all
 * `"use cache"` with the same key; Next.js dedupes per request, not four Saleor round-trips.
 */
export async function CartDrawerSlot({ params }: { params: BrowseRouteParams }) {
	const { locale: localeSlug, channel } = await params;
	const content = await getStorefrontContent(channel, localeSlug);

	return (
		<CartDrawerWrapper
			channel={channel}
			localeSlug={localeSlug}
			cart={content.surfaces.cart}
			policies={content.policies}
		/>
	);
}

/** Cached nav links — sibling Suspense to auth/cart slots under sync header frame. */
export async function HeaderNavSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	const [navItems, content, tNavHeader] = await Promise.all([
		getNavbarMenuItems(channel, locale).then((items) => serializeMenuForNav(items ?? [])),
		getStorefrontContent(channel, locale),
		getTranslations({ locale, namespace: "nav.header" }),
	]);

	return (
		<nav
			className="hidden flex-1 justify-center lg:ml-10 lg:flex xl:ml-14"
			aria-label={tNavHeader("mainAriaLabel")}
		>
			<NavLinksDesktop items={navItems} nav={content.chrome.nav} />
		</nav>
	);
}

export async function HeaderSearchSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	const tSearchBar = await getTranslations({ locale, namespace: "search.bar" });

	return (
		<div className="hidden md:flex md:max-w-md md:flex-1 md:justify-end lg:flex-none">
			<SearchBar
				locale={locale}
				channel={channel}
				placeholder={tSearchBar("placeholder")}
				srOnlyLabel={tSearchBar("srOnlyLabel")}
			/>
		</div>
	);
}

/**
 * Cookie/session header actions (user menu + cart badge) in one dynamic slot.
 * Auth SDK expiry uses `Date.now()` — a single `io()` boundary before both avoids PPF
 * misattributing the clock read to a sibling Suspense (e.g. cart badge vs user menu).
 */
export async function HeaderActionsSlot({ params }: { params: BrowseRouteParams }) {
	await cookies();
	await io();

	const { locale, channel } = await params;

	return (
		<>
			<HeaderAuthRefresh channel={channel}>
				<UserMenuServer locale={locale} channel={channel} />
			</HeaderAuthRefresh>
			<CartNavItem channel={channel} localeSlug={locale} />
		</>
	);
}

export async function HeaderMobileMenuSlot({ params }: { params: BrowseRouteParams }) {
	const { locale, channel } = await params;
	const [navItems, content, tSearchBar] = await Promise.all([
		getNavbarMenuItems(channel, locale).then((items) => serializeMenuForNav(items ?? [])),
		getStorefrontContent(channel, locale),
		getTranslations({ locale, namespace: "search.bar" }),
	]);

	return (
		<MobileMenu>
			<MobileNavLinks items={navItems} nav={content.chrome.nav} />
			<li className="py-3">
				<SearchBar
					locale={locale}
					channel={channel}
					placeholder={tSearchBar("placeholder")}
					srOnlyLabel={tSearchBar("srOnlyLabel")}
				/>
			</li>
		</MobileMenu>
	);
}
