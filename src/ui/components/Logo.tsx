"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const Logo = ({ children }: Props) => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<h1>
				<Link aria-label="homepage" href="#">
					{children}
				</Link>
			</h1>
		);
	}
	return (
		<Link aria-label="homepage" href="/">
			{children}
		</Link>
	);
};
