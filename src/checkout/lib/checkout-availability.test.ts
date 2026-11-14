import { describe, expect, it } from "vitest";

import {
	availabilityIssueForLines,
	availabilityIssueFromFieldErrors,
	bulkRemovableLineIds,
	isAvailabilityFieldError,
	partitionCheckoutFieldErrors,
	unavailableLineIdsInCart,
	unavailableVariantLabel,
} from "./checkout-availability";

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

describe("flagged lines against the current cart", () => {
	const issue = { message: "Could not add items M.", lineIds: ["line-a", "line-b", "line-c"], isExact: true };
	const cart = [{ id: "line-a" }, { id: "line-b", isGift: true }, { id: "line-d" }];

	it("lists only flagged lines that are still in the cart", () => {
		expect(unavailableLineIdsInCart(issue, cart)).toEqual(["line-a", "line-b"]);
		expect(unavailableLineIdsInCart(null, cart)).toEqual([]);
	});

	it("leaves gift lines and lines that left the cart out of a bulk removal", () => {
		expect(bulkRemovableLineIds(issue, cart)).toEqual(["line-a"]);
	});

	it("offers no bulk removal for an inexact issue", () => {
		expect(bulkRemovableLineIds({ ...issue, isExact: false }, cart)).toEqual([]);
		expect(bulkRemovableLineIds(null, cart)).toEqual([]);
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
