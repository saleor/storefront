"use client";

import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LayoutGrid, Receipt, MapPin, Settings, ArrowLeft } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/lib/auth/logout-button";
import { useAccountUser } from "@/ui/components/account/account-context";
import { accountRoutes } from "@/ui/components/account/routes";
import { stripStorefrontPrefix } from "@/lib/storefront-path";

const navItems: ReadonlyArray<{
	href: string;
	labelKey: "overview" | "orders" | "addresses" | "settings";
	icon: typeof LayoutGrid;
	exact?: boolean;
}> = [
	{ href: accountRoutes.overview, labelKey: "overview", icon: LayoutGrid, exact: true },
	{ href: accountRoutes.orders, labelKey: "orders", icon: Receipt },
	{ href: accountRoutes.addresses, labelKey: "addresses", icon: MapPin },
	{ href: accountRoutes.settings, labelKey: "settings", icon: Settings },
];

export function AccountNav() {
	const t = useTranslations("account.nav");
	const user = useAccountUser();
	const pathname = usePathname();
	const { locale, channel } = useParams<{ locale?: string; channel?: string }>();

	const isActive = (href: string, exact?: boolean) => {
		const accountPath = locale && channel ? stripStorefrontPrefix(pathname, locale, channel) : pathname;
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
				{t("backToStore")}
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

			<nav
				aria-label={t("ariaLabel")}
				className={cn(
					"bg-secondary/60 grid auto-cols-fr grid-flow-col gap-1 rounded-xl p-1",
					"md:flex md:flex-col md:gap-0.5 md:rounded-none md:bg-transparent md:p-0",
				)}
			>
				{navItems.map(({ href, labelKey, icon: Icon, exact }) => {
					const active = isActive(href, exact);
					return (
						<LinkWithChannel
							key={href}
							href={href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-xs font-medium transition-colors",
								"md:flex-row md:justify-start md:gap-3 md:px-3.5 md:py-2.5 md:text-sm",
								active
									? "bg-foreground text-background shadow-sm md:shadow-none"
									: "text-muted-foreground md:hover:bg-secondary md:hover:text-foreground",
							)}
						>
							<Icon className="h-5 w-5 shrink-0 md:h-[18px] md:w-[18px]" strokeWidth={active ? 2 : 1.75} />
							<span className="max-w-full truncate">{t(labelKey)}</span>
						</LinkWithChannel>
					);
				})}
			</nav>

			<div className="mt-auto hidden pt-10 md:block">
				<LogoutButton className="flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
					<ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
					{t("signOut")}
				</LogoutButton>
			</div>
		</div>
	);
}
