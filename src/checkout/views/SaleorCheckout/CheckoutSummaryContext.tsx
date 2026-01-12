"use client";

import { type FC } from "react";
import { type CheckoutFragment } from "@/checkout/graphql";
import { formatShippingPrice } from "@/checkout/lib/utils/money";

interface SummaryRow {
	label: string;
	value: string;
	onChangeStep?: number;
}

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
	return (
		<section className="divide-y divide-border rounded-lg border border-border text-sm">
			{rows.map((row) => (
				<div key={row.label} className="flex items-start gap-4 p-4">
					<span className="w-16 shrink-0 pt-0.5 text-muted-foreground">{row.label}</span>
					<span className="min-w-0 flex-1">{row.value}</span>
					{row.onChangeStep !== undefined && onGoToStep && (
						<button
							onClick={() => onGoToStep(row.onChangeStep!)}
							className="shrink-0 text-sm underline underline-offset-2 hover:no-underline"
						>
							Change
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
	const deliveryMethod = checkout.deliveryMethod;
	const methodId = deliveryMethod?.__typename === "ShippingMethod" ? deliveryMethod.id : undefined;
	const method = checkout.shippingMethods?.find((m) => m.id === methodId);

	if (!method) return "—";

	const priceStr = formatShippingPrice(checkout.shippingPrice?.gross);

	return `${method.name}${priceStr ? ` · ${priceStr}` : ""}`;
}

/** Build standard summary rows for shipping step */
export function buildShippingSummaryRows(checkout: CheckoutFragment): SummaryRow[] {
	return [
		{ label: "Contact", value: checkout.email || "", onChangeStep: 1 },
		{ label: "Ship to", value: formatAddressLine(checkout.shippingAddress), onChangeStep: 1 },
	];
}

/** Build standard summary rows for payment step */
export function buildPaymentSummaryRows(checkout: CheckoutFragment): SummaryRow[] {
	const rows: SummaryRow[] = [{ label: "Contact", value: checkout.email || "", onChangeStep: 1 }];

	// Only show shipping info for physical products
	if (checkout.isShippingRequired) {
		rows.push(
			{ label: "Ship to", value: formatAddressLine(checkout.shippingAddress), onChangeStep: 1 },
			{ label: "Method", value: formatShippingMethod(checkout), onChangeStep: 2 },
		);
	} else {
		// Digital products - show delivery type instead
		rows.push({ label: "Delivery", value: "Digital" });
	}

	return rows;
}
