"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ActiveLink({
	key,
	href,
	children,
}: {
	key: string;
	href: string;
	children: JSX.Element | string;
}) {
	const pathname = usePathname();

	const isActive = pathname === href;

	return (
		<Link
			key={key}
			href={href}
			className={clsx(
				isActive ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500",
				"inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700",
			)}
		>
			{children}
		</Link>
	);
}
