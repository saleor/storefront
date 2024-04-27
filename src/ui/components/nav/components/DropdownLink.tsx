"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

type Props = {
	href: string;
	children: JSX.Element | string;
};

export function DropdownLink(props: Props) {
	const pathname = usePathname();

	const isActive = pathname.includes(props.href);

	return (
		<LinkWithChannel
			href={props.href}
			className={clsx(
				isActive ? "border-neutral-500 text-neutral-500" : "border-transparent text-neutral-100",
				"m-2 block items-center text-wrap rounded-md border-b-2 px-4 py-2 text-sm font-medium hover:bg-blue-900 hover:text-neutral-400",
			)}
		>
			{props.children}
		</LinkWithChannel>
	);
}
