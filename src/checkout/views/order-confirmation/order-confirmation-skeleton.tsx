"use client";

import { useTranslations } from "next-intl";

import { OrderConfirmationPageShell } from "./order-confirmation-page-shell";
import { OrderConfirmationBodySkeleton } from "./order-confirmation-body-skeleton";

/**
 * Order confirmation loading state — uses translated shell inside `CheckoutIntlProvider`.
 */
export const OrderConfirmationSkeleton = () => {
	const t = useTranslations("checkout.actions");

	return (
		<OrderConfirmationPageShell>
			<OrderConfirmationBodySkeleton loadingLabel={t("loading")} />
		</OrderConfirmationPageShell>
	);
};
