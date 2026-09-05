"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { findOrderByNumberAction } from "@/app/(checkout)/order-actions";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";

export function OrderFindForm({
	initialNumber,
	lookupAvailable,
}: {
	initialNumber?: string;
	lookupAvailable: boolean;
}) {
	const t = useTranslations("checkout.orderFind");
	const locale = useCheckoutBrowseLocale();
	const [result, formAction, pending] = useActionState(findOrderByNumberAction, null);
	const lookupBlocked = result?.errorKey === "lookupUnavailable";

	if (!lookupAvailable || lookupBlocked) {
		return <p className="text-sm text-muted-foreground">{t("lookupUnavailable")}</p>;
	}

	return (
		<form action={formAction} className="space-y-3">
			<input type="hidden" name="locale" value={locale} />
			<Input
				type="text"
				name="number"
				inputMode="numeric"
				required
				defaultValue={initialNumber}
				placeholder={t("numberPlaceholder")}
				aria-label={t("numberLabel")}
			/>
			<Input
				type="email"
				name="email"
				autoComplete="email"
				required
				placeholder={t("emailPlaceholder")}
				aria-label={t("emailLabel")}
			/>
			{result ? <p className="text-sm text-destructive">{t(result.errorKey)}</p> : null}
			<Button type="submit" className="w-full" disabled={pending}>
				{t("submit")}
			</Button>
		</form>
	);
}
