"use client";

import { useEffect, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { type NavMenuItem, hasNavMenuChildren, isExternalNavHref } from "@/lib/menus/serialize-menu-for-nav";
import { formatContentLabel } from "@/lib/content/format-label";
import type { NavChromeContent } from "@/lib/content/types";
import { buildStorefrontPath } from "@/lib/storefront-path";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/ui/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import useSelectedPathname from "@/hooks/use-selected-pathname";
import { MegaMenuCloseContext, MegaMenuColumnHeader, MegaMenuLeafLink } from "./mega-menu-link";

const STOREFRONT_HEADER_NAV_SELECTOR = "#storefront-header nav";

/** Equal-width columns in a single row; right panel reserved for future featured content. */
const MEGA_MENU_NAV_COLUMN_CLASS = "min-w-0 flex-1";

function MegaMenuColumn({ item }: { item: NavMenuItem }) {
	const children = item.children ?? [];

	if (children.length === 0) {
		if (!item.href) {
			return null;
		}

		return (
			<div className={MEGA_MENU_NAV_COLUMN_CLASS}>
				<MegaMenuColumnHeader item={item} />
			</div>
		);
	}

	return (
		<div className={MEGA_MENU_NAV_COLUMN_CLASS}>
			<MegaMenuColumnHeader item={item} />
			<ul className="mt-2 space-y-2">
				{children.map((child) => (
					<MegaMenuLeafLink key={child.id} item={child} />
				))}
			</ul>
		</div>
	);
}

const megaMenuTriggerClassName =
	"inline-flex items-baseline justify-start h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 py-1 text-sm font-medium text-muted-foreground no-underline hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:border-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground";

const megaMenuDropdownTriggerClassName = cn(
	megaMenuTriggerClassName,
	"[&>svg]:ml-0.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0 [&>svg]:self-center [&>svg]:relative [&>svg]:top-0 [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-200 group-data-[state=open]:[&>svg]:rotate-180 group-data-[state=open]:[&>svg]:text-foreground",
);

function MegaMenuTriggerLabel({ item, onClose }: { item: NavMenuItem; onClose: () => void }) {
	const router = useRouter();
	const params = useParams<{ locale?: string; channel?: string }>();

	const navigate = () => {
		if (!item.href) {
			return;
		}

		onClose();

		if (isExternalNavHref(item.href)) {
			window.location.assign(item.href);
			return;
		}

		if (!params.locale || !params.channel) {
			window.location.assign(item.href);
			return;
		}

		router.push(buildStorefrontPath(params.locale, params.channel, item.href));
	};

	const getPointerType = (event: ReactPointerEvent | MouseEvent) => {
		if ("pointerType" in event) {
			return event.pointerType;
		}

		const nativeEvent = event.nativeEvent;
		return "pointerType" in nativeEvent ? (nativeEvent as PointerEvent).pointerType : "mouse";
	};

	const isMousePointer = (event: ReactPointerEvent | MouseEvent) => getPointerType(event) === "mouse";

	return (
		<span
			role="link"
			tabIndex={0}
			className="cursor-pointer hover:text-foreground"
			onPointerDown={(event) => {
				// On touch, let the trigger open the mega menu instead of navigating.
				if (isMousePointer(event)) {
					event.stopPropagation();
				}
			}}
			onClick={(event) => {
				if (!isMousePointer(event)) {
					return;
				}
				event.stopPropagation();
				event.preventDefault();
				navigate();
			}}
			onKeyDown={(event) => {
				if (event.key !== "Enter" && event.key !== " ") {
					return;
				}
				event.stopPropagation();
				event.preventDefault();
				navigate();
			}}
		>
			{item.label}
		</span>
	);
}

function MegaMenuPanel({
	item,
	nav,
	onClose,
}: {
	item: NavMenuItem;
	nav: NavChromeContent;
	onClose: () => void;
}) {
	const children = item.children ?? [];

	return (
		<div className="w-full">
			<div className="container-nav py-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
					<div className="lg:col-span-7 xl:col-span-6">
						<div className="flex items-start gap-x-8 lg:gap-x-10">
							{children.map((child) => (
								<MegaMenuColumn key={child.id} item={child} />
							))}
						</div>
						{item.href ? (
							<div className="mt-6 border-t border-border pt-5">
								<LinkWithChannel
									href={item.href}
									className="text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
									onClick={onClose}
								>
									{formatContentLabel(nav.viewAllLabel, { label: item.label })}
								</LinkWithChannel>
							</div>
						) : null}
					</div>
					{/* Reserved for featured products, callouts, or editorial content */}
					<div
						className="hidden lg:col-span-5 lg:block xl:col-span-6"
						data-slot="mega-menu-featured"
						aria-hidden="true"
					/>
				</div>
			</div>
		</div>
	);
}

function MegaMenuTopItem({
	item,
	nav,
	onClose,
}: {
	item: NavMenuItem;
	nav: NavChromeContent;
	onClose: () => void;
}) {
	const pathname = useSelectedPathname();

	if (hasNavMenuChildren(item)) {
		const isActive = Boolean(item.href && !isExternalNavHref(item.href) && pathname === item.href);

		return (
			<NavigationMenuItem value={item.id}>
				<NavigationMenuTrigger
					className={cn(megaMenuDropdownTriggerClassName, isActive && "border-foreground text-foreground")}
				>
					{item.href ? <MegaMenuTriggerLabel item={item} onClose={onClose} /> : item.label}
				</NavigationMenuTrigger>
				<NavigationMenuContent>
					<MegaMenuPanel item={item} nav={nav} onClose={onClose} />
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	if (!item.href) {
		return null;
	}

	const isActive = !isExternalNavHref(item.href) && pathname === item.href;
	const linkClassName = cn(megaMenuTriggerClassName, isActive && "border-foreground text-foreground");

	if (isExternalNavHref(item.href)) {
		return (
			<NavigationMenuItem value={item.id}>
				<NavigationMenuLink asChild>
					<a href={item.href} className={linkClassName} rel="noopener noreferrer" onClick={onClose}>
						{item.label}
					</a>
				</NavigationMenuLink>
			</NavigationMenuItem>
		);
	}

	return (
		<NavigationMenuItem value={item.id}>
			<NavigationMenuLink asChild>
				<LinkWithChannel href={item.href} className={linkClassName} onClick={onClose}>
					{item.label}
				</LinkWithChannel>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}

export function MegaMenuDesktop({ items, nav }: { items: NavMenuItem[]; nav: NavChromeContent }) {
	const pathname = useSelectedPathname();

	// Remount on route change so open menu state resets without an effect.
	return <MegaMenuDesktopMenu key={pathname} items={items} nav={nav} pathname={pathname} />;
}

function MegaMenuDesktopMenu({
	items,
	nav,
	pathname,
}: {
	items: NavMenuItem[];
	nav: NavChromeContent;
	pathname: string;
}) {
	const [openItem, setOpenItem] = useState("");
	const closeMenu = () => setOpenItem("");

	useEffect(() => {
		if (!openItem) {
			return;
		}

		const onPointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Element)) {
				return;
			}

			if (target.closest("[data-slot=mega-menu-panel]")) {
				return;
			}

			if (target.closest(`${STOREFRONT_HEADER_NAV_SELECTOR} button`)) {
				return;
			}

			closeMenu();
		};

		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [openItem]);

	const allProductsClassName = cn(
		megaMenuTriggerClassName,
		pathname === "/products" && "border-foreground text-foreground",
	);

	return (
		<MegaMenuCloseContext.Provider value={closeMenu}>
			<NavigationMenu
				className="max-w-none items-baseline justify-start"
				delayDuration={0}
				skipDelayDuration={0}
				value={openItem}
				onValueChange={setOpenItem}
			>
				<NavigationMenuList className="items-baseline gap-6">
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<LinkWithChannel
								href="/products"
								prefetch={true}
								className={allProductsClassName}
								onClick={closeMenu}
							>
								{nav.allProductsLabel}
							</LinkWithChannel>
						</NavigationMenuLink>
					</NavigationMenuItem>
					{items.map((item) => (
						<MegaMenuTopItem key={item.id} item={item} nav={nav} onClose={closeMenu} />
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</MegaMenuCloseContext.Provider>
	);
}
