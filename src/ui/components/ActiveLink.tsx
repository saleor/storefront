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
				isActive ? "border-gray-500" : "border-transparent",
				"inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700",
			)}
		>
			{children}
		</Link>
	);
}
