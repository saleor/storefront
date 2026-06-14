"use client";

import { type UserDetailsFragment } from "@/gql/graphql";
import { useTranslations } from "next-intl";
import { LogoutButton } from "@/lib/auth/logout-button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import { UserInfo } from "./components/user-info";
import { UserAvatar } from "./components/user-avatar";

type Props = {
	user: UserDetailsFragment;
};

export function UserMenu({ user }: Props) {
	const t = useTranslations("nav.userMenu");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-hidden relative flex rounded-full bg-secondary text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
				<span className="sr-only">{t("open")}</span>
				<UserAvatar user={user} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel className="font-normal">
					<UserInfo user={user} />
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<LinkWithChannel href="/account">{t("myAccount")}</LinkWithChannel>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<LinkWithChannel href="/account/orders">{t("myOrders")}</LinkWithChannel>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<LogoutButton className="w-full cursor-default">{t("logOut")}</LogoutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
