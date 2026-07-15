"use client";

import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { StorefrontHardLink } from "@/ui/atoms/storefront-hard-link";

/** Guest user icon — full document navigation to login (not App Router soft nav). */
export function UserMenuLoginLink({ locale, channel }: { locale: string; channel: string }) {
	const t = useTranslations("nav.userMenu");
	const href = buildStorefrontPath(locale, channel, "/login");

	return (
		<StorefrontHardLink
			href={href}
			className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
		>
			<UserIcon className="h-5 w-5" aria-hidden="true" />
			<span className="sr-only">{t("login")}</span>
		</StorefrontHardLink>
	);
}
