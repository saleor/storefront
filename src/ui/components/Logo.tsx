"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/default-channel/pages/home") {
		return (
			<h1 className="flex items-center font-bold" aria-label="homepage">
				<Image
					className="h-16 w-auto"
					src={"/CK-LOGO-101-Photoroom.svg"}
					alt="Caspian King"
					height={0}
					width={0}
				/>
			</h1>
		);
	}
	return (
		<div className="flex items-center font-bold text-neutral-200">
			<LinkWithChannel aria-label="homepage" href="/pages/home">
				<Image
					className="h-16 w-auto"
					src={"/CK-LOGO-101-Photoroom.svg"}
					alt="Caspian King"
					height={0}
					width={0}
				/>
			</LinkWithChannel>
		</div>
	);
};
