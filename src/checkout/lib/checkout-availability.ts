import type { CheckoutFieldError } from "@/checkout/lib/checkout-action-types";

export type CheckoutAvailabilityIssue = {
	message: string;
	/** Lines the stock errors point at, in cart order. */
	lineIds: string[];
	/**
	 * False when a variant label matched more lines than Saleor sent errors for it (size
	 * "M" on two products, one of them in stock). Some flagged lines may then be fine, so
	 * they must not be removed in bulk. Always true for lines read from `checkout.problems`,
	 * which names them by id.
	 */
	isExact: boolean;
	/**
	 * `"stock"`: Saleor lists the lines in `checkout.problems` (sold out, short on quantity, or
	 * no longer sold). Absent: a mutation was rejected, which is about the destination.
	 */
	cause?: "stock";
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
	return lineIds.length ? { message, lineIds, isExact: true, cause: "stock" } : null;
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
		// A loose name match in the reported issue may flag in-stock lines; keep them out of bulk removal.
		isExact: reported.isExact && fromProblems.isExact,
		cause: fromProblems.cause ?? reported.cause,
	};
}

/**
 * Text for a surface that cannot show the banner, such as a wallet payment sheet: Saleor's
 * message when it sent one, otherwise the banner copy. An issue read from `checkout.problems`
 * has no message of its own.
 */
export function availabilityIssueMessage(
	issue: CheckoutAvailabilityIssue,
	copy: { outOfStock: (count: number) => string; unavailable: string },
): string {
	if (issue.message) {
		return issue.message;
	}
	return issue.cause === "stock" ? copy.outOfStock(Math.max(issue.lineIds.length, 1)) : copy.unavailable;
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

/**
 * The reported issue after flagged lines were removed. A stock issue is dropped: the checkout
 * Saleor returns carries the live `problems`, which decide from here. A destination issue
 * keeps the flagged lines still in the cart.
 */
export function reportedIssueAfterRemoval(
	issue: CheckoutAvailabilityIssue | null,
	lines: ReadonlyArray<{ id: string }>,
): CheckoutAvailabilityIssue | null {
	return issue?.cause === "stock" ? null : availabilityIssueForLines(issue, lines);
}

/** An issue a step reported, with the checkout snapshot that was in context at the time. */
export type ReportedAvailabilityIssue = {
	issue: CheckoutAvailabilityIssue;
	against: unknown;
};

/**
 * The reported issue that still applies to `current`. A stock issue read from
 * `checkout.problems` is a snapshot: once the checkout changes, the live `problems` decide,
 * or a shopper who fixed the cart would stay blocked. A destination issue (a rejected
 * mutation in the legacy error flow) has no live counterpart and stays until cleared.
 */
export function stillReportedIssue(
	reported: ReportedAvailabilityIssue | null,
	current: unknown,
): CheckoutAvailabilityIssue | null {
	if (!reported) {
		return null;
	}
	return reported.issue.cause !== "stock" || reported.against === current ? reported.issue : null;
}

/**
 * The reported issue after a set: a value, or an updater that receives the issue still in
 * effect for `current`, the checkout the caller rendered with (it may be older than the one
 * in context by now). A new issue is tagged with that same `current`, so a stock issue that
 * has lapsed for a newer checkout stays lapsed whatever the updater returns. One an updater
 * left as it was keeps its original tag.
 */
export function nextReportedIssue(
	previous: ReportedAvailabilityIssue | null,
	action:
		| CheckoutAvailabilityIssue
		| null
		| ((issue: CheckoutAvailabilityIssue | null) => CheckoutAvailabilityIssue | null),
	current: unknown,
): ReportedAvailabilityIssue | null {
	const inEffect = stillReportedIssue(previous, current);
	const issue = typeof action === "function" ? action(inEffect) : action;
	if (!issue) {
		return null;
	}
	return previous && inEffect === issue ? previous : { issue, against: current };
}
