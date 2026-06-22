"use client";

import { createContext, useContext } from "react";
import clsx from "clsx";
import { type NavMenuItem, isExternalNavHref } from "@/lib/menus/serialize-menu-for-nav";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import useSelectedPathname from "@/hooks/use-selected-pathname";

const MegaMenuCloseContext = createContext<(() => void) | undefined>(undefined);

function useMegaMenuClose() {
	return useContext(MegaMenuCloseContext) ?? (() => undefined);
}

const leafLinkClassName =
	"block text-sm text-muted-foreground no-underline transition-colors hover:text-foreground";

export function MegaMenuLeafLink({ item }: { item: NavMenuItem }) {
	const pathname = useSelectedPathname();
	const closeMenu = useMegaMenuClose();

	if (!item.href) {
		return null;
	}

	if (isExternalNavHref(item.href)) {
		return (
			<li>
				<a href={item.href} className={leafLinkClassName} rel="noopener noreferrer" onClick={closeMenu}>
					{item.label}
				</a>
			</li>
		);
	}

	const isActive = pathname === item.href;

	return (
		<li>
			<LinkWithChannel
				href={item.href}
				prefetch={false}
				className={clsx(leafLinkClassName, isActive && "font-medium text-foreground")}
				onClick={closeMenu}
			>
				{item.label}
			</LinkWithChannel>
		</li>
	);
}

export function MegaMenuColumnHeader({ item }: { item: NavMenuItem }) {
	const className =
		"mb-0 block text-sm font-semibold tracking-tight text-foreground no-underline transition-colors hover:text-foreground/80";
	const closeMenu = useMegaMenuClose();

	if (item.href && !isExternalNavHref(item.href)) {
		return (
			<LinkWithChannel href={item.href} prefetch={false} className={className} onClick={closeMenu}>
				{item.label}
			</LinkWithChannel>
		);
	}

	if (item.href) {
		return (
			<a href={item.href} className={className} rel="noopener noreferrer" onClick={closeMenu}>
				{item.label}
			</a>
		);
	}

	return <p className={className}>{item.label}</p>;
}

export { MegaMenuCloseContext };
