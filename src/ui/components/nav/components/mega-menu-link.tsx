"use client";

import clsx from "clsx";
import { type NavMenuItem, isExternalNavHref } from "@/lib/menus/serialize-menu-for-nav";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import useSelectedPathname from "@/hooks/use-selected-pathname";

const leafLinkClassName = "block text-sm text-muted-foreground transition-colors hover:text-foreground";

export function MegaMenuLeafLink({ item }: { item: NavMenuItem }) {
	const pathname = useSelectedPathname();

	if (!item.href) {
		return null;
	}

	if (isExternalNavHref(item.href)) {
		return (
			<li>
				<a href={item.href} className={leafLinkClassName} rel="noopener noreferrer">
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
			>
				{item.label}
			</LinkWithChannel>
		</li>
	);
}

export function MegaMenuColumnHeader({ item }: { item: NavMenuItem }) {
	const className = "mb-3 block text-sm font-semibold text-foreground";

	if (item.href && !isExternalNavHref(item.href)) {
		return (
			<LinkWithChannel href={item.href} prefetch={false} className={clsx(className, "hover:underline")}>
				{item.label}
			</LinkWithChannel>
		);
	}

	if (item.href) {
		return (
			<a href={item.href} className={clsx(className, "hover:underline")} rel="noopener noreferrer">
				{item.label}
			</a>
		);
	}

	return <p className={className}>{item.label}</p>;
}
