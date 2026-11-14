import { describe, expect, it } from "vitest";

import {
	availabilityIssueFromFieldErrors,
	availabilityIssueFromProblems,
	isAvailabilityFieldError,
	matchUnavailableLineIds,
	mergeAvailabilityIssues,
	messageMentionsVariant,
	partitionCheckoutFieldErrors,
	unavailableLineIdsFromProblems,
} from "./checkout-availability";

describe("unavailableLineIdsFromProblems", () => {
	it("collects the lines Saleor reports as out of stock or not available", () => {
		expect(
			unavailableLineIdsFromProblems([
				{ __typename: "CheckoutLineProblemInsufficientStock", line: { id: "line-a" } },
				{ __typename: "CheckoutLineProblemVariantNotAvailable", line: { id: "line-b" } },
			]),
		).toEqual(["line-a", "line-b"]);
	});

	it("ignores delivery problems and lists each line once", () => {
		expect(
			unavailableLineIdsFromProblems([
				{ __typename: "CheckoutProblemDeliveryMethodStale" },
				{ __typename: "CheckoutProblemDeliveryMethodInvalid" },
				{ __typename: "CheckoutLineProblemInsufficientStock", line: { id: "line-a" } },
				{ __typename: "CheckoutLineProblemVariantNotAvailable", line: { id: "line-a" } },
			]),
		).toEqual(["line-a"]);
	});

	it("returns nothing when the checkout has no problems", () => {
		expect(unavailableLineIdsFromProblems(null)).toEqual([]);
		expect(unavailableLineIdsFromProblems(undefined)).toEqual([]);
		expect(unavailableLineIdsFromProblems([])).toEqual([]);
	});
});

describe("availabilityIssueFromProblems", () => {
	it("builds an issue for the affected lines", () => {
		expect(
			availabilityIssueFromProblems([
				{ __typename: "CheckoutLineProblemInsufficientStock", line: { id: "line-a" } },
			]),
		).toEqual({ message: "", lineIds: ["line-a"], cause: "stock" });
	});

	it("returns null when only delivery problems are present", () => {
		expect(availabilityIssueFromProblems([{ __typename: "CheckoutProblemDeliveryMethodStale" }])).toBeNull();
	});
});

describe("mergeAvailabilityIssues", () => {
	it("returns whichever issue exists", () => {
		const issue = { message: "Out of stock", lineIds: ["line-a"] };
		expect(mergeAvailabilityIssues(null, null)).toBeNull();
		expect(mergeAvailabilityIssues(issue, null)).toBe(issue);
		expect(mergeAvailabilityIssues(null, issue)).toBe(issue);
	});

	it("unions the lines, keeps the reported message and takes the stock cause", () => {
		expect(
			mergeAvailabilityIssues(
				{ message: "Could not add items M.", lineIds: ["line-a"] },
				{ message: "", lineIds: ["line-a", "line-b"], cause: "stock" },
			),
		).toEqual({ message: "Could not add items M.", lineIds: ["line-a", "line-b"], cause: "stock" });
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
