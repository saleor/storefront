"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { verifyOrderEmailAction } from "@/app/(checkout)/order-actions";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";

export function OrderEmailGate({ orderId }: { orderId: string }) {
	const t = useTranslations("checkout.orderFind");
	const locale = useCheckoutBrowseLocale();
	const [result, formAction, pending] = useActionState(verifyOrderEmailAction, null);

	return (
		<form action={formAction} className="space-y-3">
			<input type="hidden" name="orderId" value={orderId} />
			<input type="hidden" name="locale" value={locale} />
			<p className="text-sm text-muted-foreground">{t("emailGateBody")}</p>
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
				{t("confirmEmail")}
			</Button>
		</form>
	);
}
