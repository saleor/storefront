"use client";

import clsx from "clsx";
import { type ReactElement, useCallback } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

export function NavLink({ href, children }: { href: string; children: ReactElement | string }) {
	const pathname = useSelectedPathname();
	const isActive = pathname === href;
	const handleClick = useCallback(() => {
		if (typeof window === "undefined") {
			return;
		}
		if (window.innerWidth < 1200) {
			window.dispatchEvent(new Event("mobile-nav-close"));
		}
	}, []);

	return (
		<li>
			<LinkWithChannel href={href} className={clsx({ active: isActive })} onClick={handleClick}>
				{children}
			</LinkWithChannel>
		</li>
	);
}
