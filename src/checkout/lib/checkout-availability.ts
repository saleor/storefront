import type { CheckoutFieldError } from "@/checkout/lib/checkout-action-types";

/**
 * A destination issue: Saleor rejected a checkout mutation for stock at this address (its legacy
 * error flow). It has no live counterpart in `checkout.problems`, so a step reports it.
 */
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
	quantity?: number;
	isGift?: boolean | null;
	variant?: { id?: string; name?: string | null; sku?: string | null } | null;
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

/** One `checkout.problems` entry, as the checkout fragment selects it. */
export type CheckoutProblemLike = {
	__typename?: string;
	availableQuantity?: number | null;
	line?: { id: string } | null;
};

/**
 * A line Saleor cannot fulfil in full. `availableQuantity`: how many this line may keep, 0 when
 * none (sold out, or no longer sold).
 */
export type StockLine = { id: string; quantity: number; availableQuantity: number };

type StockCheckout = {
	isShippingRequired: boolean;
	shippingAddress?: unknown;
	problems?: ReadonlyArray<CheckoutProblemLike> | null;
	lines: ReadonlyArray<AvailabilityLine>;
};

/**
 * Every line `checkout.problems` lists as short or no longer sold, gift lines included, with how
 * many this line may keep.
 *
 * Saleor checks stock per variant: it adds up the quantities of all lines of a variant (gift lines
 * too) and flags each of them with the variant's total. A line's share is that total minus what
 * the variant's other lines ask for, so lowering any one flagged line to its share fixes the variant.
 *
 * Before a shipping address exists, Saleor judges stock for the channel's default country
 * (`checkout.country`), which may not be where the shopper ships. Those answers are not used.
 */
function shortLines(checkout: StockCheckout | null | undefined): Array<StockLine & { isGift: boolean }> {
	if (!checkout || (checkout.isShippingRequired && !checkout.shippingAddress)) {
		return [];
	}
	const variantLeft = new Map<string, number>();
	for (const problem of checkout.problems ?? []) {
		const id = problem.line?.id;
		if (!id) continue;
		if (problem.__typename === "CheckoutLineProblemVariantNotAvailable") {
			variantLeft.set(id, 0);
		} else if (problem.__typename === "CheckoutLineProblemInsufficientStock") {
			const left = Math.max(0, problem.availableQuantity ?? 0);
			variantLeft.set(id, Math.min(variantLeft.get(id) ?? left, left));
		}
	}

	const askedPerVariant = new Map<string, number>();
	for (const line of checkout.lines) {
		const variantId = line.variant?.id;
		if (variantId)
			askedPerVariant.set(variantId, (askedPerVariant.get(variantId) ?? 0) + (line.quantity ?? 0));
	}

	return checkout.lines.flatMap((line) => {
		const left = variantLeft.get(line.id);
		if (left === undefined) return [];
		const quantity = line.quantity ?? 0;
		const variantId = line.variant?.id;
		const askedByOthers = variantId ? (askedPerVariant.get(variantId) ?? quantity) - quantity : 0;
		return [
			{
				id: line.id,
				quantity,
				availableQuantity: Math.max(0, left - askedByOthers),
				isGift: Boolean(line.isGift),
			},
		];
	});
}

/**
 * Lines the shopper must change before paying, in cart order. With the channel's legacy error flow
 * off, `problems` is the only place Saleor reports stock before `checkoutComplete`, which is after
 * the shopper has paid. Gift lines are left out: see `unavailableGiftLineIds`.
 */
export function stockLinesFromProblems(checkout: StockCheckout | null | undefined): StockLine[] {
	return shortLines(checkout)
		.filter((line) => !line.isGift)
		.map((line) => ({ id: line.id, quantity: line.quantity, availableQuantity: line.availableQuantity }));
}

/**
 * Gift lines `problems` lists while no line the shopper can change is short. Saleor refuses to
 * delete a gift line, and swaps it for a gift in stock (or drops it) whenever it recalculates
 * discounts, which re-submitting the shipping address before Continue and Pay does. So these get
 * a note instead of a block, and the check before paying fails if one is still listed after that.
 * A gift sharing a variant with a short line the shopper can change clears with that line.
 */
export function unavailableGiftLineIds(checkout: StockCheckout | null | undefined): string[] {
	const short = shortLines(checkout);
	return short.some((line) => !line.isGift) ? [] : short.map((line) => line.id);
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

	const flagged = new Set(issue.lineIds);
	const lineIds = lines.filter((line) => flagged.has(line.id)).map((line) => line.id);
	return lineIds.length ? { ...issue, lineIds } : null;
}

/**
 * The same issue without one line, after the shopper changed that line to what Saleor has for
 * this address. `null` once no flagged line is left.
 */
export function availabilityIssueWithoutLine(
	issue: CheckoutAvailabilityIssue | null,
	lineId: string,
): CheckoutAvailabilityIssue | null {
	if (!issue?.lineIds.includes(lineId)) {
		return issue;
	}
	const lineIds = issue.lineIds.filter((id) => id !== lineId);
	return lineIds.length ? { ...issue, lineIds } : null;
}

/**
 * A line the shopper cannot buy as it is. `availableQuantity`: how many this line may keep
 * (0: none). `null` when only the destination check flagged it, which says no number.
 */
export type FlaggedLine = { id: string; quantity: number; availableQuantity: number | null };

/** What blocks the shopper: live stock lines and a reported destination issue. */
export type CheckoutAvailability = {
	/** From the live checkout's `problems`, so they clear as soon as Saleor clears them. */
	stock: StockLine[];
	destination: CheckoutAvailabilityIssue | null;
	/** Every flagged line still in the cart, in cart order. Never gift lines, which the shopper cannot change. */
	lines: FlaggedLine[];
	/**
	 * Lines one `checkoutLinesDelete` may remove: nothing of them is left, or a destination
	 * issue matched them exactly. Never gift lines, which Saleor refuses to delete.
	 */
	removableLineIds: string[];
	/** Changes only when the flagged lines or what is left of them change. */
	key: string;
};

export function checkoutAvailability(
	checkout: StockCheckout | null | undefined,
	destination: CheckoutAvailabilityIssue | null,
): CheckoutAvailability | null {
	const cart = checkout?.lines ?? [];
	const stock = stockLinesFromProblems(checkout);
	const reported = availabilityIssueForLines(destination, cart);
	if (stock.length === 0 && !reported) {
		return null;
	}

	const left = new Map<string, number | null>(stock.map((line) => [line.id, line.availableQuantity]));
	for (const id of reported?.lineIds ?? []) {
		if (!left.has(id)) left.set(id, null);
	}
	const removable = new Set([
		...stock.filter((line) => line.availableQuantity === 0).map((line) => line.id),
		...(reported?.isExact ? reported.lineIds : []),
	]);
	const lines = cart
		.filter((line) => left.has(line.id) && !line.isGift)
		.map((line) => ({
			id: line.id,
			quantity: line.quantity ?? 0,
			availableQuantity: left.get(line.id) ?? null,
		}));
	return {
		stock,
		destination: reported,
		lines,
		removableLineIds: cart.filter((line) => removable.has(line.id) && !line.isGift).map((line) => line.id),
		key: lines.map((line) => `${line.id}:${line.availableQuantity ?? "-"}`).join(","),
	};
}
