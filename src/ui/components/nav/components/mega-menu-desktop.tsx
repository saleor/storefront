"use client";

import { type NavMenuItem, hasNavMenuChildren, isExternalNavHref } from "@/lib/menus/serialize-menu-for-nav";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerClassName,
} from "@/ui/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import useSelectedPathname from "@/hooks/use-selected-pathname";
import { MegaMenuColumnHeader, MegaMenuLeafLink } from "./mega-menu-link";

function MegaMenuColumn({ item }: { item: NavMenuItem }) {
	const children = item.children ?? [];

	if (children.length === 0) {
		if (!item.href) {
			return null;
		}

		return (
			<div>
				<MegaMenuColumnHeader item={item} />
			</div>
		);
	}

	return (
		<div className="min-w-0">
			<MegaMenuColumnHeader item={item} />
			<ul className="mt-2 space-y-2">
				{children.map((child) => (
					<MegaMenuLeafLink key={child.id} item={child} />
				))}
			</ul>
		</div>
	);
}

function megaMenuLayout(columnCount: number): { panel: string; grid: string } {
	if (columnCount >= 4) {
		return { panel: "w-[48rem]", grid: "grid-cols-4" };
	}
	if (columnCount === 3) {
		return { panel: "w-[36rem]", grid: "grid-cols-3" };
	}
	if (columnCount === 2) {
		return { panel: "w-[24rem]", grid: "grid-cols-2" };
	}
	return { panel: "w-[14rem]", grid: "grid-cols-1" };
}

function MegaMenuPanel({ item }: { item: NavMenuItem }) {
	const children = item.children ?? [];
	const { panel, grid } = megaMenuLayout(children.length);

	return (
		<div className={cn("p-6", panel)}>
			<div className={cn("grid gap-8", grid)}>
				{children.map((child) => (
					<MegaMenuColumn key={child.id} item={child} />
				))}
			</div>
			{item.href ? (
				<div className="mt-4 border-t border-border pt-4">
					<LinkWithChannel
						href={item.href}
						prefetch={false}
						className="text-sm font-medium text-primary hover:underline"
					>
						View all {item.label}
					</LinkWithChannel>
				</div>
			) : null}
		</div>
	);
}

function MegaMenuTopItem({ item }: { item: NavMenuItem }) {
	const pathname = useSelectedPathname();

	if (hasNavMenuChildren(item)) {
		return (
			<NavigationMenuItem>
				<NavigationMenuTrigger className="bg-transparent text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground">
					{item.label}
				</NavigationMenuTrigger>
				<NavigationMenuContent className="w-max">
					<MegaMenuPanel item={item} />
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	if (!item.href) {
		return null;
	}

	const isActive = !isExternalNavHref(item.href) && pathname === item.href;
	const linkClassName = cn(
		navigationMenuTriggerClassName,
		"bg-transparent hover:bg-transparent",
		isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
	);

	if (isExternalNavHref(item.href)) {
		return (
			<NavigationMenuItem>
				<NavigationMenuLink asChild>
					<a href={item.href} className={linkClassName} rel="noopener noreferrer">
						{item.label}
					</a>
				</NavigationMenuLink>
			</NavigationMenuItem>
		);
	}

	return (
		<NavigationMenuItem>
			<NavigationMenuLink asChild>
				<LinkWithChannel href={item.href} prefetch={false} className={linkClassName}>
					{item.label}
				</LinkWithChannel>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}

export function MegaMenuDesktop({ items }: { items: NavMenuItem[] }) {
	const pathname = useSelectedPathname();
	const allProductsClassName = cn(
		navigationMenuTriggerClassName,
		"bg-transparent hover:bg-transparent",
		pathname === "/products" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
	);

	return (
		<NavigationMenu className="max-w-none justify-start">
			<NavigationMenuList className="gap-6">
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<LinkWithChannel href="/products" prefetch={false} className={allProductsClassName}>
							All
						</LinkWithChannel>
					</NavigationMenuLink>
				</NavigationMenuItem>
				{items.map((item) => (
					<MegaMenuTopItem key={item.id} item={item} />
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
