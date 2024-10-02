"use client";

import clsx from "clsx";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

export function NavLink({ href, children }: { href: string; children: JSX.Element | string }) {
	const pathname = useSelectedPathname();
	const isActive = pathname === href;

	return (
		<li className="inline-flex">
			<LinkWithChannel
				href={href}
				className={clsx(
					isActive ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500",
					"inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700",
				)}
			>
				{children}
			</LinkWithChannel>
		</li>
	);
}
