"use client";

import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import { LayoutGrid, Receipt, MapPin, Settings, ArrowLeft } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions";
import { useAccountUser } from "@/ui/components/account/account-context";
import { accountRoutes } from "@/ui/components/account/routes";

const navItems: ReadonlyArray<{
	href: string;
	label: string;
	icon: typeof LayoutGrid;
	exact?: boolean;
}> = [
	{ href: accountRoutes.overview, label: "Overview", icon: LayoutGrid, exact: true },
	{ href: accountRoutes.orders, label: "Orders", icon: Receipt },
	{ href: accountRoutes.addresses, label: "Addresses", icon: MapPin },
	{ href: accountRoutes.settings, label: "Settings", icon: Settings },
];

export function AccountNav() {
	const user = useAccountUser();
	const pathname = usePathname();
	const { channel } = useParams<{ channel: string }>();

	const channelPrefix = `/${channel}`;

	const isActive = (href: string, exact?: boolean) => {
		const accountPath = pathname.startsWith(channelPrefix) ? pathname.slice(channelPrefix.length) : pathname;
		if (exact) return accountPath === href;
		return accountPath.startsWith(href);
	};

	const initials =
		user.firstName && user.lastName
			? `${user.firstName[0]}${user.lastName[0]}`
			: user.email.slice(0, 2).toUpperCase();

	return (
		<div className="flex flex-col">
			<LinkWithChannel
				href="/"
				className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
			>
				<span className="text-base leading-none">&lsaquo;</span>
				Back to store
			</LinkWithChannel>

			<div className="mb-8 hidden md:block">
				{user.avatar ? (
					<Image
						src={user.avatar.url}
						alt={user.avatar.alt ?? ""}
						width={44}
						height={44}
						className="mb-3 h-11 w-11 rounded-full"
					/>
				) : (
					<div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
						{initials}
					</div>
				)}
				<p className="font-semibold leading-tight">
					{user.firstName} {user.lastName}
				</p>
				<p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
			</div>

			<nav aria-label="Account" className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5">
				{navItems.map(({ href, label, icon: Icon, exact }) => {
					const active = isActive(href, exact);
					return (
						<LinkWithChannel
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								"whitespace-nowrap",
								active
									? "bg-foreground text-background"
									: "text-muted-foreground hover:bg-secondary hover:text-foreground",
							)}
						>
							<Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.75} />
							{label}
						</LinkWithChannel>
					);
				})}
			</nav>

			<div className="mt-auto hidden pt-10 md:block">
				<form action={logout}>
					<button
						type="submit"
						className="flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
						Sign out
					</button>
				</form>
			</div>
		</div>
	);
}
