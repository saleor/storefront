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

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Saleor copy is "Could not add items {variantName}." — match that token, not a prefix. */
export function messageMentionsVariant(message: string, variantName: string): boolean {
	const name = variantName.trim();
	if (!name) {
		return false;
	}

	return new RegExp(`\\bitems?\\s+${escapeRegExp(name)}(?=\\b|[.])`, "i").test(message);
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

	const message = first.message ?? fallbackMessage;
	return {
		message,
		lineIds: matchUnavailableLineIds(lines, message),
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
