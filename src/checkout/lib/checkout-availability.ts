import type { CheckoutFieldError } from "@/checkout/lib/checkout-action-types";

export type CheckoutAvailabilityIssue = {
	message: string;
	lineIds: string[];
	/**
	 * `"stock"`: Saleor lists the lines in `checkout.problems` (sold out, short on quantity, or
	 * no longer sold). Absent: a mutation was rejected, which is about the destination.
	 */
	cause?: "stock";
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

/** Shape of the `checkout.problems` entries this module reads. */
export type CheckoutProblemLike = {
	__typename?: string;
	line?: { id: string } | null;
};

const LINE_PROBLEM_TYPES: ReadonlySet<string> = new Set([
	"CheckoutLineProblemInsufficientStock",
	"CheckoutLineProblemVariantNotAvailable",
]);

/** Line ids Saleor flags as out of stock or no longer available in `checkout.problems`. */
export function unavailableLineIdsFromProblems(
	problems: ReadonlyArray<CheckoutProblemLike> | null | undefined,
): string[] {
	const lineIds = new Set<string>();
	for (const problem of problems ?? []) {
		if (problem.__typename && LINE_PROBLEM_TYPES.has(problem.__typename) && problem.line?.id) {
			lineIds.add(problem.line.id);
		}
	}
	return [...lineIds];
}

/**
 * With the channel's legacy error flow off (`useLegacyErrorFlow: false`), Saleor no longer
 * rejects checkout mutations for stock. It lists the affected lines in `checkout.problems`
 * and only fails at `checkoutComplete`, which is after the shopper has paid.
 */
export function availabilityIssueFromProblems(
	problems: ReadonlyArray<CheckoutProblemLike> | null | undefined,
	message = "",
): CheckoutAvailabilityIssue | null {
	const lineIds = unavailableLineIdsFromProblems(problems);
	return lineIds.length ? { message, lineIds, cause: "stock" } : null;
}

/** Combine the issue a step reported with the one read from `checkout.problems`. */
export function mergeAvailabilityIssues(
	reported: CheckoutAvailabilityIssue | null,
	fromProblems: CheckoutAvailabilityIssue | null,
): CheckoutAvailabilityIssue | null {
	if (!reported || !fromProblems) {
		return reported ?? fromProblems;
	}

	return {
		message: reported.message || fromProblems.message,
		lineIds: [...new Set([...reported.lineIds, ...fromProblems.lineIds])],
		cause: fromProblems.cause ?? reported.cause,
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
