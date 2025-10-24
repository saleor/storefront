"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import logoImage from "@/images/sds_assets/logo.png";

const companyName = "SDS";

export const Logo = () => {
	const pathname = usePathname();

	const logoContent = (
		<Image
			src={logoImage}
			alt={companyName}
			width={108}
			height={48}
			className="h-10 w-auto object-contain md:h-12"
			priority
			sizes="(max-width: 768px) 90px, 108px"
		/>
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
