import { describe, expect, it } from "vitest";

import {
	availabilityIssueFromFieldErrors,
	availabilityIssueWithoutLines,
	isAvailabilityFieldError,
	matchUnavailableLineIds,
	messageMentionsVariant,
	partitionCheckoutFieldErrors,
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

describe("messageMentionsVariant", () => {
	it("matches Saleor's items {variantName} copy, not a prefix", () => {
		const saleor = "Could not add items M. Only 0 remaining in stock.";
		expect(messageMentionsVariant(saleor, "M")).toBe(true);
		expect(messageMentionsVariant(saleor, "Medium")).toBe(false);
		expect(messageMentionsVariant("Could not add items Medium.", "M")).toBe(false);
		expect(messageMentionsVariant("Could not add items Medium.", "Medium")).toBe(true);
	});

	it("does not match an unrelated mention of the letter", () => {
		expect(messageMentionsVariant("Missing required field.", "M")).toBe(false);
	});

	it("requires the whole variant name, not a leading or trailing word of it", () => {
		const saleor = "Could not add items Pink Dahlia. Only 0 remaining in stock.";
		expect(messageMentionsVariant(saleor, "Pink Dahlia")).toBe(true);
		expect(messageMentionsVariant(saleor, "Pink")).toBe(false);
		expect(messageMentionsVariant(saleor, "Dahlia")).toBe(false);
	});

	it("keeps periods and regex characters that are part of the name", () => {
		expect(messageMentionsVariant("Could not add items No. 5. Only 2 remaining in stock.", "No. 5")).toBe(
			true,
		);
		expect(messageMentionsVariant("Could not add items No. 5. Only 2 remaining in stock.", "No")).toBe(false);
		expect(
			messageMentionsVariant(
				"Could not add items 0.5 L (glass). Only 0 remaining in stock.",
				"0.5 L (glass)",
			),
		).toBe(true);
	});

	it("ignores surrounding whitespace in the line's variant name", () => {
		expect(messageMentionsVariant("Could not add items M. Only 0 remaining in stock.", " M ")).toBe(true);
	});
});

describe("availabilityIssueFromFieldErrors", () => {
	it("builds an issue from stock errors and matched lines", () => {
		expect(
			availabilityIssueFromFieldErrors(
				[{ id: "line-m", variant: { name: "M" } }],
				[
					{
						field: "quantity",
						message: "Could not add items M. Only 0 remaining in stock.",
						code: "INSUFFICIENT_STOCK",
					},
				],
			),
		).toEqual({
			message: "Could not add items M. Only 0 remaining in stock.",
			lineIds: ["line-m"],
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
				[
					{
						field: "quantity",
						message: "Could not add items Pink Dahlia. Only 0 remaining in stock.",
						code: "INSUFFICIENT_STOCK",
					},
					{
						field: "quantity",
						message: "Could not add items Rose Candle. Only 0 remaining in stock.",
						code: "INSUFFICIENT_STOCK",
					},
				],
			),
		).toEqual({
			message: "Could not add items Pink Dahlia. Only 0 remaining in stock.",
			lineIds: ["line-dahlia", "line-rose"],
		});
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

describe("matchUnavailableLineIds", () => {
	const lines = [
		{ id: "line-m", variant: { name: "M" } },
		{ id: "line-medium", variant: { name: "Medium" } },
	];

	it("matches the named variant only", () => {
		expect(matchUnavailableLineIds(lines, "Could not add items M. Only 0 remaining in stock.")).toEqual([
			"line-m",
		]);
	});
});

describe("availabilityIssueWithoutLines", () => {
	const issue = { message: "Could not add items M.", lineIds: ["line-a", "line-b", "line-c"] };

	it("keeps the issue for the lines that are still in the cart", () => {
		expect(availabilityIssueWithoutLines(issue, ["line-b"])).toEqual({
			message: "Could not add items M.",
			lineIds: ["line-a", "line-c"],
		});
	});

	it("resolves the issue once every flagged line is removed", () => {
		expect(availabilityIssueWithoutLines(issue, ["line-a", "line-b", "line-c"])).toBeNull();
	});

	it("returns null when there is no issue", () => {
		expect(availabilityIssueWithoutLines(null, ["line-a"])).toBeNull();
	});
});
