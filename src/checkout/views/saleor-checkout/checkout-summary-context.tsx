"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { type CheckoutFragment } from "@/checkout/graphql";
import { formatShippingPrice } from "@/checkout/lib/utils/money";

interface SummaryRow {
	label: string;
	value: string;
	onChangeStep?: number;
}

export type CheckoutSummaryLabels = {
	contact: string;
	shipTo: string;
	method: string;
	delivery: string;
	digital: string;
};

interface CheckoutSummaryContextProps {
	checkout: CheckoutFragment;
	/** Rows to display (Contact, Ship to, Method) */
	rows: SummaryRow[];
	/** Callback when user clicks Change */
	onGoToStep?: (step: number) => void;
}

/**
 * Summary context showing current checkout state (Contact, Ship to, Method).
 * Used in ShippingStep and PaymentStep to show context from previous steps.
 */
export const CheckoutSummaryContext: FC<CheckoutSummaryContextProps> = ({ rows, onGoToStep }) => {
	const tCommon = useTranslations("account.common");

	return (
		<section className="divide-y divide-border rounded-lg border border-border text-sm">
			{rows.map((row) => (
				<div key={row.label} className="flex items-start gap-4 p-4">
					<span className="w-16 shrink-0 pt-0.5 text-muted-foreground">{row.label}</span>
					<span className="min-w-0 flex-1 break-words">{row.value}</span>
					{row.onChangeStep !== undefined && onGoToStep && (
						<button
							type="button"
							onClick={() => onGoToStep(row.onChangeStep!)}
							className="shrink-0 text-sm underline underline-offset-2 hover:no-underline"
						>
							{tCommon("change")}
						</button>
					)}
				</div>
			))}
		</section>
	);
};

// =============================================================================
// Helper functions to build summary rows
// =============================================================================

/** Format address as single line string */
export function formatAddressLine(address: CheckoutFragment["shippingAddress"]): string {
	if (!address) return "";
	return `${address.streetAddress1}, ${address.city} ${address.postalCode}, ${address.country?.country}`;
}

/** Get shipping method display string */
export function formatShippingMethod(checkout: CheckoutFragment): string {
	const delivery = checkout.delivery;
	if (!delivery?.shippingMethod) return "—";

	const priceStr = formatShippingPrice(checkout.shippingPrice?.gross);

	return `${delivery.shippingMethod.name}${priceStr ? ` · ${priceStr}` : ""}`;
}

/** Build standard summary rows for shipping step */
export function buildShippingSummaryRows(
	checkout: CheckoutFragment,
	labels: CheckoutSummaryLabels,
): SummaryRow[] {
	return [
		{ label: labels.contact, value: checkout.email || "", onChangeStep: 1 },
		{ label: labels.shipTo, value: formatAddressLine(checkout.shippingAddress), onChangeStep: 1 },
	];
}

/** Build standard summary rows for payment step */
export function buildPaymentSummaryRows(
	checkout: CheckoutFragment,
	labels: CheckoutSummaryLabels,
): SummaryRow[] {
	const rows: SummaryRow[] = [{ label: labels.contact, value: checkout.email || "", onChangeStep: 1 }];

	if (checkout.isShippingRequired) {
		rows.push(
			{ label: labels.shipTo, value: formatAddressLine(checkout.shippingAddress), onChangeStep: 1 },
			{ label: labels.method, value: formatShippingMethod(checkout), onChangeStep: 2 },
		);
	} else {
		rows.push({ label: labels.delivery, value: labels.digital });
	}

	return rows;
}

/** Labels for summary row builders — call from client components inside IntlProvider. */
export function useCheckoutSummaryLabels(): CheckoutSummaryLabels {
	const t = useTranslations("checkout.summary");
	return {
		contact: t("contact"),
		shipTo: t("shipTo"),
		method: t("method"),
		delivery: t("delivery"),
		digital: t("digital"),
	};
}
