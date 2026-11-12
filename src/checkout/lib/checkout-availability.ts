import type { CheckoutFieldError } from "@/checkout/lib/checkout-action-types";

export type CheckoutAvailabilityIssue = {
	message: string;
	lineIds: string[];
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

/** Saleor copy: "Could not add items {variantName}. Only {n} remaining in stock." */
const SALEOR_STOCK_MESSAGE = /\bitems?\s+(.+?)\.(?:\s+Only\s+\d+\s+remaining\b.*)?$/i;

/**
 * True when the message names exactly this variant. The whole name must match: an error
 * about "Pink Dahlia" must not flag a line whose variant is "Pink".
 *
 * This error carries no variant or line ids, so the name is the only signal. Two lines
 * whose variants share a name (size "M" on two products) are both flagged.
 */
export function messageMentionsVariant(message: string, variantName: string): boolean {
	const name = variantName.trim();
	if (!name) {
		return false;
	}

	return SALEOR_STOCK_MESSAGE.exec(message)?.[1]?.trim() === name;
}

export function availabilityIssueFromFieldErrors(
	lines: ReadonlyArray<{
		id: string;
		variant?: { name?: string | null } | null;
	}>,
	fieldErrors: ReadonlyArray<CheckoutFieldError>,
	fallbackMessage = "",
): CheckoutAvailabilityIssue | null {
	const { availability } = partitionCheckoutFieldErrors(fieldErrors);
	const first = availability[0];
	if (!first) {
		return null;
	}

	// Saleor returns one error per unavailable variant ("Could not add items X."), so
	// collect the lines from every error, not just the first — otherwise only one item
	// is flagged and the others look purchasable.
	const lineIds = new Set<string>();
	for (const error of availability) {
		for (const id of matchUnavailableLineIds(lines, error.message ?? "")) {
			lineIds.add(id);
		}
	}

	return {
		message: first.message ?? fallbackMessage,
		lineIds: [...lineIds],
	};
}

export function matchUnavailableLineIds(
	lines: ReadonlyArray<{
		id: string;
		variant?: { name?: string | null } | null;
	}>,
	message: string,
): string[] {
	return lines
		.filter((line) => messageMentionsVariant(message, line.variant?.name ?? ""))
		.map((line) => line.id);
}

/** Drop removed lines from an issue. The issue is resolved once no flagged line is left. */
export function availabilityIssueWithoutLines(
	issue: CheckoutAvailabilityIssue | null,
	removedLineIds: ReadonlyArray<string>,
): CheckoutAvailabilityIssue | null {
	if (!issue) {
		return null;
	}

	const removed = new Set(removedLineIds);
	const lineIds = issue.lineIds.filter((id) => !removed.has(id));
	return lineIds.length ? { ...issue, lineIds } : null;
}
