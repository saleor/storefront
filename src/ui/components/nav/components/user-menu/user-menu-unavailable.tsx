"use client";

import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/** Session cookies exist but `me` could not be loaded — not the same as signed out. */
export function UserMenuUnavailable() {
	const t = useTranslations("nav.userMenu");

	return (
		<div
			className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground"
			title={t("unavailableTitle")}
			aria-label={t("unavailableAriaLabel")}
		>
			<UserIcon className="h-5 w-5" aria-hidden="true" />
		</div>
	);
}
