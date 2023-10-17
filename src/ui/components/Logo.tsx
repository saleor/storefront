"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const companyName = "ACME";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<h1 className="flex items-center font-bold" aria-label="homepage">
				{companyName}
			</h1>
		);
	}
	return (
		<div className="flex items-center font-bold">
			<Link aria-label="homepage" href="/">
				{companyName}
			</Link>
		</div>
	);
};
