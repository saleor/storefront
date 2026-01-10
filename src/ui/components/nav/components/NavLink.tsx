"use client";

import clsx from "clsx";
import { type ReactElement } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

export function NavLink({ href, children }: { href: string; children: ReactElement | string }) {
	const pathname = useSelectedPathname();
	const isActive = pathname === href;

	return (
		<li className="inline-flex">
			<LinkWithChannel
				href={href}
				className={clsx(
					"text-sm font-medium transition-colors",
					isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
				)}
			>
				{children}
			</LinkWithChannel>
		</li>
	);
}
