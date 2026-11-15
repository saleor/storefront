import type { CheckoutFieldError } from "@/checkout/lib/checkout-action-types";

export type CheckoutAvailabilityIssue = {
	message: string;
	/** Lines the stock errors point at, in cart order. */
	lineIds: string[];
	/**
	 * False when a variant label matched more lines than Saleor sent errors for it (size
	 * "M" on two products, one of them in stock). Some flagged lines may then be fine, so
	 * they must not be removed in bulk.
	 */
	isExact: boolean;
};

export type AvailabilityLine = {
	id: string;
	isGift?: boolean | null;
	variant?: { name?: string | null; sku?: string | null } | null;
};

export function isAvailabilityFieldError(error: { field?: string | null; code?: string | null }): boolean {
	return error.field === "quantity" || error.field === "variant" || error.code === "INSUFFICIENT_STOCK";
}

export function partitionCheckoutFieldErrors(errors: ReadonlyArray<CheckoutFieldError>): {
	address: CheckoutFieldError[];
	availability: CheckoutFieldError[];
} {
	const address: CheckoutFieldError[] = [];
	const availability: CheckoutFieldError[] = [];

	for (const error of errors) {
		if (isAvailabilityFieldError(error)) {
			availability.push(error);
		} else {
			address.push(error);
		}
	}

	return { address, availability };
}

/** Saleor copy: "Could not add items {variant}. Only {n} remaining in stock." */
const SALEOR_STOCK_MESSAGE = /\bitems?\s+(.+?)(?:\.\s+Only\s+-?\d+\s+remaining\b.*)?\.?\s*$/i;

/**
 * The variant label in a Saleor stock error, or null when the message has another shape.
 * The label is read whole, so an error about "Pink Dahlia" cannot flag a line whose
 * variant is "Pink".
 */
export function unavailableVariantLabel(message: string): string | null {
	return SALEOR_STOCK_MESSAGE.exec(message)?.[1]?.trim() || null;
}

/**
 * How Saleor prints a variant in that error: its name, or its SKU when the name is empty.
 * (Its last resort, "ID:<pk>" for a variant with neither, is not matched.)
 */
function variantLabel(variant: AvailabilityLine["variant"]): string {
	return variant?.name?.trim() || variant?.sku?.trim() || "";
}

/**
 * Saleor sends one stock error per unavailable variant and names the variant only in the
 * message text (no variant or line ids on this path). Every line whose label appears in
 * an error is flagged.
 */
export function availabilityIssueFromFieldErrors(
	lines: ReadonlyArray<AvailabilityLine>,
	fieldErrors: ReadonlyArray<CheckoutFieldError>,
	fallbackMessage = "",
): CheckoutAvailabilityIssue | null {
	const { availability } = partitionCheckoutFieldErrors(fieldErrors);
	const first = availability[0];
	if (!first) {
		return null;
	}

	const errorsPerLabel = new Map<string, number>();
	for (const error of availability) {
		const label = unavailableVariantLabel(error.message ?? "");
		if (label) {
			errorsPerLabel.set(label, (errorsPerLabel.get(label) ?? 0) + 1);
		}
	}

	const lineIds: string[] = [];
	const linesPerLabel = new Map<string, number>();
	for (const line of lines) {
		const label = variantLabel(line.variant);
		if (errorsPerLabel.has(label)) {
			lineIds.push(line.id);
			linesPerLabel.set(label, (linesPerLabel.get(label) ?? 0) + 1);
		}
	}

	return {
		message: first.message ?? fallbackMessage,
		lineIds,
		isExact: [...linesPerLabel].every(([label, count]) => count <= (errorsPerLabel.get(label) ?? 0)),
	};
}

/** Flagged lines that are still in the cart, in cart order. */
export function unavailableLineIdsInCart(
	issue: CheckoutAvailabilityIssue | null,
	lines: ReadonlyArray<{ id: string }>,
): string[] {
	if (!issue) {
		return [];
	}

	const flagged = new Set(issue.lineIds);
	return lines.filter((line) => flagged.has(line.id)).map((line) => line.id);
}

/**
 * Flagged lines the banner may remove in one `checkoutLinesDelete` call. Saleor rejects
 * the whole call for a gift line or an id that left the cart, and an inexact issue may
 * flag lines that are in stock.
 */
export function bulkRemovableLineIds(
	issue: CheckoutAvailabilityIssue | null,
	lines: ReadonlyArray<{ id: string; isGift?: boolean | null }>,
): string[] {
	if (!issue?.isExact) {
		return [];
	}

	return unavailableLineIdsInCart(
		issue,
		lines.filter((line) => !line.isGift),
	);
}

/**
 * Drop flagged lines that left the cart (removed here, in another tab, or by Saleor).
 * The issue is resolved once none of its flagged lines is left.
 */
export function availabilityIssueForLines(
	issue: CheckoutAvailabilityIssue | null,
	lines: ReadonlyArray<{ id: string }>,
): CheckoutAvailabilityIssue | null {
	// An issue that matched no line stays until the next stock check.
	if (!issue || issue.lineIds.length === 0) {
		return issue;
	}

	const lineIds = unavailableLineIdsInCart(issue, lines);
	return lineIds.length ? { ...issue, lineIds } : null;
}
