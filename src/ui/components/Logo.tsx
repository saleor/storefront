"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

const companyName = "RaceDay";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return <h1 className="sitename">{companyName}</h1>;
	}
	return (
		<LinkWithChannel className="logo d-flex align-items-center" aria-label="homepage" href="/">
			<h1 className="sitename">{companyName}</h1>
		</LinkWithChannel>
	);
};
