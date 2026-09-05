"use client";

import { useTranslations } from "next-intl";

export function FindOrderCopy() {
	const t = useTranslations("checkout.orderFind");

	return (
		<div className="space-y-2">
			<h1 className="text-balance text-h2">{t("title")}</h1>
			<p className="text-sm text-muted-foreground">{t("body")}</p>
		</div>
	);
}
