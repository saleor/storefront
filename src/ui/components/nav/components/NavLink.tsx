"use client";

import clsx from "clsx";
import { type ReactElement } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

export function NavLink({
	href,
	children,
	isMobile = false,
	index = 0,
}: {
	href: string;
	children: ReactElement | string;
	isMobile?: boolean;
	index?: number;
}) {
	const pathname = useSelectedPathname();
	const isActive = pathname === href;

	if (isMobile) {
		return (
			<LinkWithChannel
				href={href}
				className={clsx(
					isActive ? "text-accent-400" : "text-white",
					"mobile-nav-link block text-right text-4xl font-thin uppercase transition-colors duration-300 hover:text-accent-400 focus-visible:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-5xl md:text-6xl",
				)}
				style={{ "--animation-delay": `${index * 0.1}s` } as React.CSSProperties}
			>
				{children}
			</LinkWithChannel>
		);
	}

	return (
		<li className="inline-flex">
			<LinkWithChannel
				href={href}
				className={clsx(
					isActive ? "text-accent-400" : "text-base-300",
					"inline-flex items-center pt-px text-sm font-light tracking-wide transition-colors duration-300 hover:text-accent-400",
				)}
			>
				{children}
			</LinkWithChannel>
		</li>
	);
}
