"use client";

import { useTranslations } from "next-intl";
import { useAccountUser } from "@/ui/components/account/account-context";

export function AccountOverviewWelcome() {
	const t = useTranslations("account.overview");
	const user = useAccountUser();
	const displayName = user.firstName || user.email.split("@")[0] || "";

	return (
		<div>
			<h1 className="text-2xl font-semibold tracking-tight">{t("welcome", { name: displayName })}</h1>
			<p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
		</div>
	);
}
