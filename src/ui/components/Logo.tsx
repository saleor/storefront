"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Crown } from "lucide-react";

const companyName = "Luxior Mall";

export const Logo = () => {
	const pathname = usePathname();

	const logoContent = (
		<div className="flex items-center gap-2">
			<Crown className="h-6 w-6 text-primary-600" />
			<span className="text-xl font-bold text-secondary-900">{companyName}</span>
		</div>
	);

	if (pathname === "/") {
		return (
			<h1 className="flex items-center" aria-label="homepage">
				{logoContent}
			</h1>
		);
	}
	
	return (
		<div className="flex items-center">
			<LinkWithChannel aria-label="homepage" href="/">
				{logoContent}
			</LinkWithChannel>
		</div>
	);
};
