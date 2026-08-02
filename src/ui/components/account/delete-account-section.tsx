"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { requestAccountDeletion } from "@/app/(storefront)/[locale]/[channel]/(main)/account/actions";
import { resolveAccountActionError } from "@/ui/components/account/account-action-result";
import { buildStorefrontPath } from "@/lib/storefront-path";

export function DeleteAccountSection() {
	const t = useTranslations("account.deleteAccount");
	const tAccount = useTranslations("account");
	const tCommon = useTranslations("account.common");
	const params = useParams<{ locale: string; channel: string }>();
	const [showConfirm, setShowConfirm] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);

	function handleDelete() {
		setError("");
		startTransition(async () => {
			const formData = new FormData();
			formData.set(
				"redirectUrl",
				`${window.location.origin}${buildStorefrontPath(params.locale, params.channel)}`,
			);
			formData.set("channel", params.channel);
			const result = await requestAccountDeletion(formData);
			if (!result.success) {
				setError(resolveAccountActionError(tAccount, result));
			} else {
				setSent(true);
			}
		});
	}

	if (sent) {
		return (
			<div aria-live="polite" className="rounded-lg border border-border bg-green-50 p-4">
				<p className="text-sm text-green-800">{t("emailSent")}</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div>
				<p className="text-sm font-medium text-destructive">{t("title")}</p>
				<p className="text-sm text-muted-foreground">{t("description")}</p>
			</div>

			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}

			{!showConfirm ? (
				<Button variant="destructive" size="sm" onClick={() => setShowConfirm(true)}>
					{t("submit")}
				</Button>
			) : (
				<div className="border-destructive/20 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
					<div className="space-y-3">
						<p className="text-sm">{t("confirmBody")}</p>
						<div className="flex gap-2">
							<Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
								{isPending ? tCommon("sending") : t("confirm")}
							</Button>
							<Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
								{tCommon("cancel")}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
