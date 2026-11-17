import { describe, expect, it } from "vitest";

import {
	availabilityIssueForLines,
	availabilityIssueFromFieldErrors,
	availabilityIssueWithoutLine,
	checkoutAvailability,
	isAvailabilityFieldError,
	partitionCheckoutFieldErrors,
	stockLinesFromProblems,
	unavailableGiftLineIds,
	unavailableVariantLabel,
} from "./checkout-availability";

const address = { id: "addr" };
const short = (lineId: string, availableQuantity: number | null) => ({
	__typename: "CheckoutLineProblemInsufficientStock",
	availableQuantity,
	line: { id: lineId },
});
const notSold = (lineId: string) => ({
	__typename: "CheckoutLineProblemVariantNotAvailable",
	line: { id: lineId },
});

describe("stockLinesFromProblems", () => {
	const lines = [
		{ id: "line-a", quantity: 3 },
		{ id: "line-b", quantity: 1 },
		{ id: "line-c", quantity: 2 },
	];

	it("lists short and no-longer-sold lines with what is left, in cart order", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines,
				problems: [notSold("line-c"), short("line-a", 1)],
			}),
		).toEqual([
			{ id: "line-a", quantity: 3, availableQuantity: 1 },
			{ id: "line-c", quantity: 2, availableQuantity: 0 },
		]);
	});

	it("ignores delivery problems and takes the lower count when a line is reported twice", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines,
				problems: [
					{ __typename: "CheckoutProblemDeliveryMethodStale" },
					short("line-a", 2),
					notSold("line-a"),
					short("line-b", 0),
				],
			}),
		).toEqual([
			{ id: "line-a", quantity: 3, availableQuantity: 0 },
			{ id: "line-b", quantity: 1, availableQuantity: 0 },
		]);
	});

	it("reads a missing or negative count as nothing left", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines,
				problems: [short("line-a", -2), short("line-b", null)],
			}).map((line) => line.availableQuantity),
		).toEqual([0, 0]);
	});

	it("does not use answers given for the channel's default country before an address exists", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: null,
				lines,
				problems: [short("line-a", 0)],
			}),
		).toEqual([]);
	});

	it("reads the problems of a checkout that needs no shipping", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: false,
				shippingAddress: null,
				lines,
				problems: [notSold("line-b")],
			}),
		).toEqual([{ id: "line-b", quantity: 1, availableQuantity: 0 }]);
	});

	it("leaves out gift lines and lines no longer in the cart", () => {
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines: [{ id: "line-gift", quantity: 1, isGift: true }, ...lines],
				problems: [notSold("line-gift"), notSold("line-gone")],
			}),
		).toEqual([]);
	});

	it("has nothing to list without a checkout or problems", () => {
		expect(stockLinesFromProblems(null)).toEqual([]);
		expect(stockLinesFromProblems({ isShippingRequired: true, shippingAddress: address, lines })).toEqual([]);
	});

	it("gives each line of a variant its share of what is left, counting the variant's gift line", () => {
		// Saleor sums the variant over all its lines and flags each with the variant's total (2).
		const variant = { id: "variant-v" };
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines: [
					{ id: "line-paid", quantity: 2, variant },
					{ id: "line-gift", quantity: 1, isGift: true, variant },
				],
				problems: [short("line-paid", 2), short("line-gift", 2)],
			}),
		).toEqual([{ id: "line-paid", quantity: 2, availableQuantity: 1 }]);
	});

	it("never asks a line of a split variant to drop below zero", () => {
		const variant = { id: "variant-v" };
		expect(
			stockLinesFromProblems({
				isShippingRequired: true,
				shippingAddress: address,
				lines: [
					{ id: "line-small", quantity: 1, variant },
					{ id: "line-big", quantity: 3, variant },
				],
				problems: [short("line-small", 3), short("line-big", 3)],
			}),
		).toEqual([
			// Removing the small line or lowering the big one to 2 each fixes the variant.
			{ id: "line-small", quantity: 1, availableQuantity: 0 },
			{ id: "line-big", quantity: 3, availableQuantity: 2 },
		]);
	});
});

describe("unavailableGiftLineIds", () => {
	it("lists a gift line Saleor reports short while no paid line is", () => {
		expect(
			unavailableGiftLineIds({
				isShippingRequired: true,
				shippingAddress: address,
				lines: [
					{ id: "line-a", quantity: 1, variant: { id: "variant-a" } },
					{ id: "line-gift", quantity: 1, isGift: true, variant: { id: "variant-g" } },
				],
				problems: [short("line-gift", 0)],
			}),
		).toEqual(["line-gift"]);
	});

	it("lists nothing while a paid line is short: fixing it may clear the gift too", () => {
		const variant = { id: "variant-v" };
		expect(
			unavailableGiftLineIds({
				isShippingRequired: true,
				shippingAddress: address,
				lines: [
					{ id: "line-paid", quantity: 2, variant },
					{ id: "line-gift", quantity: 1, isGift: true, variant },
				],
				problems: [short("line-paid", 2), short("line-gift", 2)],
			}),
		).toEqual([]);
	});

	it("waits for a shipping address, like the other stock answers", () => {
		expect(
			unavailableGiftLineIds({
				isShippingRequired: true,
				shippingAddress: null,
				lines: [{ id: "line-gift", quantity: 1, isGift: true }],
				problems: [short("line-gift", 0)],
			}),
		).toEqual([]);
	});
});

describe("isAvailabilityFieldError", () => {
	it("treats quantity, variant, and INSUFFICIENT_STOCK as availability", () => {
		expect(isAvailabilityFieldError({ field: "quantity" })).toBe(true);
		expect(isAvailabilityFieldError({ field: "variant" })).toBe(true);
		expect(isAvailabilityFieldError({ code: "INSUFFICIENT_STOCK" })).toBe(true);
		expect(isAvailabilityFieldError({ field: "streetAddress1" })).toBe(false);
	});
});

describe("partitionCheckoutFieldErrors", () => {
	it("splits stock errors away from address fields", () => {
		expect(
			partitionCheckoutFieldErrors([
				{ field: "postalCode", message: "Enter a valid ZIP.", code: "INVALID" },
				{
					field: "quantity",
					message: "Could not add items M. Only 0 remaining in stock.",
					code: "INSUFFICIENT_STOCK",
				},
			]),
		).toEqual({
			address: [{ field: "postalCode", message: "Enter a valid ZIP.", code: "INVALID" }],
			availability: [
				{
					field: "quantity",
					message: "Could not add items M. Only 0 remaining in stock.",
					code: "INSUFFICIENT_STOCK",
				},
			],
		});
	});
});

const stockError = (variant: string, remaining = 0) => ({
	field: "quantity",
	message: `Could not add items ${variant}. Only ${remaining} remaining in stock.`,
	code: "INSUFFICIENT_STOCK" as const,
});

describe("unavailableVariantLabel", () => {
	it("reads the variant label from Saleor's stock copy", () => {
		expect(unavailableVariantLabel("Could not add items M. Only 0 remaining in stock.")).toBe("M");
		expect(unavailableVariantLabel("Could not add items Medium.")).toBe("Medium");
	});

	it("reads the whole label, not a leading word of it", () => {
		expect(unavailableVariantLabel("Could not add items Pink Dahlia. Only 0 remaining in stock.")).toBe(
			"Pink Dahlia",
		);
	});

	it("keeps periods and regex characters that are part of the label", () => {
		expect(unavailableVariantLabel("Could not add items No. 5. Only 2 remaining in stock.")).toBe("No. 5");
		expect(unavailableVariantLabel("Could not add items 0.5 L (glass). Only 0 remaining in stock.")).toBe(
			"0.5 L (glass)",
		);
	});

	it("tolerates a missing final period and trailing whitespace", () => {
		expect(unavailableVariantLabel("Could not add items M")).toBe("M");
		expect(unavailableVariantLabel("Could not add items M. ")).toBe("M");
		expect(unavailableVariantLabel("Could not add items M. Only 0 remaining in stock.\n")).toBe("M");
	});

	it("returns null for a message with another shape", () => {
		expect(unavailableVariantLabel("Missing required field.")).toBeNull();
	});
});

describe("availabilityIssueFromFieldErrors", () => {
	it("builds an issue from stock errors and matched lines", () => {
		expect(
			availabilityIssueFromFieldErrors([{ id: "line-m", variant: { name: "M" } }], [stockError("M")]),
		).toEqual({
			message: "Could not add items M. Only 0 remaining in stock.",
			lineIds: ["line-m"],
			isExact: true,
		});
	});

	it("flags every unavailable line when Saleor returns one error per variant", () => {
		expect(
			availabilityIssueFromFieldErrors(
				[
					{ id: "line-dahlia", variant: { name: "Pink Dahlia" } },
					{ id: "line-rose", variant: { name: "Rose Candle" } },
					{ id: "line-ok", variant: { name: "Vanilla" } },
				],
				[stockError("Pink Dahlia"), stockError("Rose Candle")],
			),
		).toEqual({
			message: "Could not add items Pink Dahlia. Only 0 remaining in stock.",
			lineIds: ["line-dahlia", "line-rose"],
			isExact: true,
		});
	});

	it("does not flag a line whose variant name is only part of the unavailable one", () => {
		const issue = availabilityIssueFromFieldErrors(
			[
				{ id: "line-m", variant: { name: "M" } },
				{ id: "line-medium", variant: { name: "Medium" } },
				{ id: "line-pink", variant: { name: "Pink" } },
				{ id: "line-pink-dahlia", variant: { name: " Pink Dahlia " } },
			],
			[stockError("Medium"), stockError("Pink Dahlia")],
		);
		expect(issue?.lineIds).toEqual(["line-medium", "line-pink-dahlia"]);
	});

	it("matches a variant without a name by its SKU, as Saleor prints it", () => {
		const issue = availabilityIssueFromFieldErrors(
			[
				{ id: "line-unnamed", variant: { name: "", sku: "CNDL-01" } },
				{ id: "line-named", variant: { name: "Vanilla", sku: "CNDL-02" } },
			],
			[stockError("CNDL-01")],
		);
		expect(issue?.lineIds).toEqual(["line-unnamed"]);
	});

	it("is inexact when one error could mean either of two lines with the same variant name", () => {
		const issue = availabilityIssueFromFieldErrors(
			[
				{ id: "line-tshirt-m", variant: { name: "M" } },
				{ id: "line-hoodie-m", variant: { name: "M" } },
			],
			[stockError("M")],
		);
		expect(issue).toMatchObject({ lineIds: ["line-tshirt-m", "line-hoodie-m"], isExact: false });
	});

	it("is exact when Saleor sent an error for each line with that variant name", () => {
		const issue = availabilityIssueFromFieldErrors(
			[
				{ id: "line-tshirt-m", variant: { name: "M" } },
				{ id: "line-hoodie-m", variant: { name: "M" } },
			],
			[stockError("M"), stockError("M")],
		);
		expect(issue).toMatchObject({ lineIds: ["line-tshirt-m", "line-hoodie-m"], isExact: true });
	});

	it("uses the fallback message and still matches lines when the first error has no message", () => {
		expect(
			availabilityIssueFromFieldErrors(
				[{ id: "line-rose", variant: { name: "Rose Candle" } }],
				[{ field: "quantity", message: null, code: "INSUFFICIENT_STOCK" }, stockError("Rose Candle")],
				"fallback copy",
			),
		).toEqual({ message: "fallback copy", lineIds: ["line-rose"], isExact: true });
	});

	it("returns null when there is no stock error", () => {
		expect(
			availabilityIssueFromFieldErrors(
				[{ id: "line-m", variant: { name: "M" } }],
				[{ field: "postalCode", message: "Enter a valid ZIP.", code: "INVALID" }],
			),
		).toBeNull();
	});
});

describe("availabilityIssueForLines", () => {
	const issue = { message: "Could not add items M.", lineIds: ["line-a", "line-b"], isExact: true };

	it("keeps the issue for flagged lines that are still in the cart", () => {
		expect(availabilityIssueForLines(issue, [{ id: "line-b" }, { id: "line-x" }])).toEqual({
			...issue,
			lineIds: ["line-b"],
		});
	});

	it("resolves the issue once no flagged line is left in the cart", () => {
		expect(availabilityIssueForLines(issue, [{ id: "line-x" }])).toBeNull();
	});

	it("keeps an issue that matched no line", () => {
		const unmatched = { message: "Could not add items M.", lineIds: [], isExact: true };
		expect(availabilityIssueForLines(unmatched, [{ id: "line-x" }])).toBe(unmatched);
		expect(availabilityIssueForLines(null, [{ id: "line-x" }])).toBeNull();
	});
});

describe("availabilityIssueWithoutLine", () => {
	const issue = { message: "Could not add items M.", lineIds: ["line-a", "line-b"], isExact: true };

	it("drops the line the shopper changed", () => {
		expect(availabilityIssueWithoutLine(issue, "line-a")).toEqual({ ...issue, lineIds: ["line-b"] });
	});

	it("resolves the issue once its last line is changed", () => {
		expect(availabilityIssueWithoutLine({ ...issue, lineIds: ["line-a"] }, "line-a")).toBeNull();
	});

	it("leaves an issue alone when the line is not one of its lines", () => {
		expect(availabilityIssueWithoutLine(issue, "line-x")).toBe(issue);
		expect(availabilityIssueWithoutLine(null, "line-x")).toBeNull();
	});
});

describe("checkoutAvailability", () => {
	const lines = [
		{ id: "line-a", quantity: 3 },
		{ id: "line-b", quantity: 1 },
		{ id: "line-c", quantity: 2 },
		{ id: "line-gift", quantity: 1, isGift: true },
	];
	const withProblems = (problems: ReturnType<typeof short | typeof notSold>[]) => ({
		isShippingRequired: true,
		shippingAddress: address,
		lines,
		problems,
	});

	it("is null when nothing blocks", () => {
		expect(checkoutAvailability(withProblems([]), null)).toBeNull();
		expect(checkoutAvailability(null, null)).toBeNull();
	});

	it("flags each line with what is left; only lines with nothing left are removed in bulk", () => {
		const availability = checkoutAvailability(withProblems([short("line-a", 1), notSold("line-c")]), null);
		expect(availability?.lines).toEqual([
			{ id: "line-a", quantity: 3, availableQuantity: 1 },
			{ id: "line-c", quantity: 2, availableQuantity: 0 },
		]);
		expect(availability?.removableLineIds).toEqual(["line-c"]);
		expect(availability?.destination).toBeNull();
	});

	it("adds the destination issue's lines, with no count and no gift, and removes them in bulk when exact", () => {
		const availability = checkoutAvailability(withProblems([short("line-a", 1)]), {
			message: "Could not add items M.",
			lineIds: ["line-a", "line-b", "line-gift"],
			isExact: true,
		});
		// Saleor refuses to delete gift lines, so the shopper is not offered one.
		expect(availability?.lines).toEqual([
			{ id: "line-a", quantity: 3, availableQuantity: 1 },
			{ id: "line-b", quantity: 1, availableQuantity: null },
		]);
		expect(availability?.removableLineIds).toEqual(["line-a", "line-b"]);
	});

	it("removes no destination line in bulk when the issue may have flagged an in-stock line", () => {
		const availability = checkoutAvailability(withProblems([notSold("line-c")]), {
			message: "Could not add items M.",
			lineIds: ["line-a", "line-b"],
			isExact: false,
		});
		expect(availability?.removableLineIds).toEqual(["line-c"]);
	});

	it("still blocks for a destination issue that matched no line", () => {
		const destination = { message: "Could not add items ID:7.", lineIds: [], isExact: true };
		expect(checkoutAvailability(withProblems([]), destination)).toMatchObject({
			lines: [],
			removableLineIds: [],
			destination,
		});
	});

	it("still blocks, with nothing to remove, when the destination issue flagged only a gift", () => {
		const destination = { message: "Could not add items G.", lineIds: ["line-gift"], isExact: true };
		expect(checkoutAvailability(withProblems([]), destination)).toMatchObject({
			lines: [],
			removableLineIds: [],
			destination,
		});
	});

	it("drops destination lines that left the cart", () => {
		expect(
			checkoutAvailability(withProblems([]), { message: "", lineIds: ["line-gone"], isExact: true }),
		).toBeNull();
	});

	it("changes its key only when the flagged lines or what is left of them change", () => {
		const key = (problems: ReturnType<typeof short>[]) =>
			checkoutAvailability(withProblems(problems), null)?.key;
		expect(key([short("line-a", 1)])).toBe(key([short("line-a", 1)]));
		expect(key([short("line-a", 1)])).not.toBe(key([short("line-a", 0)]));
		expect(key([short("line-a", 1)])).not.toBe(key([short("line-a", 1), short("line-b", 0)]));
	});
});
