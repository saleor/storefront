"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/link-with-channel";
import { Logo as SharedLogo } from "./shared/logo";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<h1 className="flex shrink-0 items-center" aria-label="Paper by Saleor homepage">
				<SharedLogo className="h-7 w-auto" />
			</h1>
		);
	}
	return (
		<div className="flex shrink-0 items-center">
			<LinkWithChannel aria-label="Paper by Saleor homepage" href="/">
				<SharedLogo className="h-7 w-auto" />
			</LinkWithChannel>
		</div>
	);
};
