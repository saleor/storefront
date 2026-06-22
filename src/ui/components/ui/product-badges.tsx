"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/components/ui/badge";

/**
 * Product status chips ("Sale" / "New"). Client-only because the labels come from
 * next-intl, which is wired into the storefront surface only (ADR 0002). Do not render
 * these off-surface (checkout, OG images) where no `NextIntlClientProvider` exists.
 */

/** "Sale" chip for PLP cards, PDP header, etc. */
export function SaleBadge({ className }: { className?: string }) {
	const t = useTranslations("pdp.badges");

	return (
		<Badge variant="destructive" className={cn("text-xs", className)}>
			{t("sale")}
		</Badge>
	);
}

/** "New" chip for PLP cards. */
export function NewBadge({ className }: { className?: string }) {
	const t = useTranslations("pdp.badges");

	return <Badge className={cn("text-xs", className)}>{t("new")}</Badge>;
}
