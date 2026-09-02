import { describe, expect, it } from "vitest";

import {
	availabilityIssueFromFieldErrors,
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
