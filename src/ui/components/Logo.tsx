"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Logo = () => {
	const pathname = usePathname();
	const companyName = "ACME";

	if (pathname === "/") {
		return (
			<h1 className="flex items-center font-bold">
				<Link aria-label="homepage" href="#">
					{companyName}
				</Link>
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
