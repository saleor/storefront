"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import {
	deleteAddress,
	setDefaultAddress,
} from "@/app/(storefront)/[locale]/[channel]/(main)/account/actions";

type DeleteProps = {
	addressId: string;
};

export function DeleteAddressButton({ addressId }: DeleteProps) {
	const t = useTranslations("account");
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showConfirm, setShowConfirm] = useState(false);

	function handleDelete() {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("id", addressId);
			const result = await deleteAddress(formData);
			if (result.success) {
				setShowConfirm(false);
				router.refresh();
			}
		});
	}

	if (showConfirm) {
		return (
			<div className="flex items-center gap-1">
				<Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
					{isPending ? "…" : t("common.delete")}
				</Button>
				<Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
					{t("common.cancel")}
				</Button>
			</div>
		);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => setShowConfirm(true)}
			disabled={isPending}
			aria-label={t("addresses.deleteAddressAria")}
		>
			<Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
		</Button>
	);
}

type SetDefaultProps = {
	addressId: string;
	type: "SHIPPING" | "BILLING";
};

export function SetDefaultAddressButton({ addressId, type }: SetDefaultProps) {
	const t = useTranslations("account.addresses");
	const tCommon = useTranslations("account.common");
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function handleSetDefault() {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("id", addressId);
			formData.set("type", type);
			const result = await setDefaultAddress(formData);
			if (result.success) {
				router.refresh();
			}
		});
	}

	const label = type === "SHIPPING" ? t("makeDefaultShipping") : t("makeDefaultBilling");

	return (
		<button
			type="button"
			onClick={handleSetDefault}
			disabled={isPending}
			className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isPending ? tCommon("saving") : label}
		</button>
	);
}
