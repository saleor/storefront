import { describe, expect, it } from "vitest";

import {
	availabilityIssueForLines,
	availabilityIssueFromFieldErrors,
	availabilityIssueFromProblems,
	bulkRemovableLineIds,
	isAvailabilityFieldError,
	mergeAvailabilityIssues,
	nextReportedIssue,
	partitionCheckoutFieldErrors,
	reportedIssueAfterRemoval,
	stillReportedIssue,
	unavailableLineIdsFromProblems,
	unavailableLineIdsInCart,
	unavailableVariantLabel,
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
	it("builds an exact issue for the affected lines", () => {
		expect(
			availabilityIssueFromProblems([
				{ __typename: "CheckoutLineProblemInsufficientStock", line: { id: "line-a" } },
			]),
		).toEqual({ message: "", lineIds: ["line-a"], isExact: true, cause: "stock" });
	});

	it("returns null when only delivery problems are present", () => {
		expect(availabilityIssueFromProblems([{ __typename: "CheckoutProblemDeliveryMethodStale" }])).toBeNull();
	});
});

describe("mergeAvailabilityIssues", () => {
	it("returns whichever issue exists", () => {
		const issue = { message: "Out of stock", lineIds: ["line-a"], isExact: true };
		expect(mergeAvailabilityIssues(null, null)).toBeNull();
		expect(mergeAvailabilityIssues(issue, null)).toBe(issue);
		expect(mergeAvailabilityIssues(null, issue)).toBe(issue);
	});

	it("unions the lines, keeps the reported message and takes the stock cause", () => {
		expect(
			mergeAvailabilityIssues(
				{ message: "Could not add items M.", lineIds: ["line-a"], isExact: true },
				{ message: "", lineIds: ["line-a", "line-b"], isExact: true, cause: "stock" },
			),
		).toEqual({
			message: "Could not add items M.",
			lineIds: ["line-a", "line-b"],
			isExact: true,
			cause: "stock",
		});
	});

	it("is inexact when the reported issue is, so bulk removal cannot take an in-stock line", () => {
		const merged = mergeAvailabilityIssues(
			{ message: "Could not add items M.", lineIds: ["line-a", "line-c"], isExact: false },
			{ message: "", lineIds: ["line-b"], isExact: true, cause: "stock" },
		);
		expect(merged?.isExact).toBe(false);
		expect(bulkRemovableLineIds(merged, [{ id: "line-a" }, { id: "line-b" }, { id: "line-c" }])).toEqual([]);
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

describe("stillReportedIssue", () => {
	const before = { id: "chk", problems: [] };
	const after = { id: "chk", problems: [] };
	const stock = { message: "", lineIds: ["line-a"], isExact: true, cause: "stock" as const };
	const destination = { message: "Could not add items M.", lineIds: ["line-a"], isExact: true };

	it("keeps a stock issue while the checkout is the one it was reported against", () => {
		expect(stillReportedIssue({ issue: stock, against: before }, before)).toBe(stock);
	});

	it("drops a stock issue once the checkout changes, so the live problems decide", () => {
		expect(stillReportedIssue({ issue: stock, against: before }, after)).toBeNull();
	});

	it("keeps a destination issue across checkout changes", () => {
		expect(stillReportedIssue({ issue: destination, against: before }, after)).toBe(destination);
	});

	it("has nothing to keep when nothing was reported", () => {
		expect(stillReportedIssue(null, before)).toBeNull();
	});
});

describe("nextReportedIssue", () => {
	const before = { id: "chk", problems: [] };
	const after = { id: "chk", problems: [] };
	const stock = { message: "", lineIds: ["line-a"], isExact: true, cause: "stock" as const };
	const destination = { message: "Could not add items M.", lineIds: ["line-a", "line-b"], isExact: true };

	it("tags a set value with the checkout in context", () => {
		expect(nextReportedIssue(null, destination, after)).toEqual({ issue: destination, against: after });
	});

	it("clears on null", () => {
		expect(nextReportedIssue({ issue: destination, against: before }, null, after)).toBeNull();
	});

	it("hands an updater the issue still in effect, never a lapsed stock issue", () => {
		const seen: unknown[] = [];
		const result = nextReportedIssue(
			{ issue: stock, against: before },
			(issue) => {
				seen.push(issue);
				return issue && availabilityIssueForLines(issue, [{ id: "line-a" }]);
			},
			after,
		);
		expect(seen).toEqual([null]);
		expect(result).toBeNull();
	});

	it("keeps the original tag when an updater leaves the issue unchanged", () => {
		const previous = { issue: stock, against: before };
		expect(nextReportedIssue(previous, (issue) => issue, before)).toBe(previous);
	});

	it("re-tags an issue an updater changed", () => {
		const result = nextReportedIssue(
			{ issue: destination, against: before },
			(issue) => availabilityIssueForLines(issue, [{ id: "line-b" }]),
			after,
		);
		expect(result).toEqual({ issue: { ...destination, lineIds: ["line-b"] }, against: after });
	});
});

describe("bulk removal across both error flows", () => {
	it("offers the reported lines and the lines in problems, but no gift line", () => {
		const merged = mergeAvailabilityIssues(
			{ message: "Could not add items M.", lineIds: ["line-a"], isExact: true },
			availabilityIssueFromProblems([
				{ __typename: "CheckoutLineProblemInsufficientStock", line: { id: "line-b" } },
				{ __typename: "CheckoutLineProblemVariantNotAvailable", line: { id: "line-gift" } },
			]),
		);
		expect(
			bulkRemovableLineIds(merged, [
				{ id: "line-a" },
				{ id: "line-b" },
				{ id: "line-gift", isGift: true },
				{ id: "line-ok" },
			]),
		).toEqual(["line-a", "line-b"]);
	});
});

describe("reportedIssueAfterRemoval", () => {
	const stock = { message: "", lineIds: ["line-a"], isExact: true, cause: "stock" as const };
	const destination = { message: "Could not add items M.", lineIds: ["line-a", "line-b"], isExact: true };

	it("drops a stock issue, so the live problems decide", () => {
		expect(reportedIssueAfterRemoval(stock, [{ id: "line-a" }])).toBeNull();
	});

	it("keeps the lines of a destination issue that are still in the cart", () => {
		expect(reportedIssueAfterRemoval(destination, [{ id: "line-b" }, { id: "line-c" }])).toEqual({
			...destination,
			lineIds: ["line-b"],
		});
	});

	it("resolves a destination issue once none of its lines is left", () => {
		expect(reportedIssueAfterRemoval(destination, [{ id: "line-c" }])).toBeNull();
	});

	it("has nothing to update when nothing was reported", () => {
		expect(reportedIssueAfterRemoval(null, [])).toBeNull();
	});
});

describe("nextReportedIssue dispatched from an older checkout snapshot", () => {
	// The provider's setter closes over the checkout it rendered with. By the time a slow
	// response dispatches, a newer checkout may be in context.
	const older = { id: "chk", problems: [] };
	const newer = { id: "chk", problems: [] };
	const stock = { message: "", lineIds: ["line-a", "line-b"], isExact: true, cause: "stock" as const };

	it("keeps a stock issue lapsed for the newer checkout when the updater returns it as is", () => {
		const next = nextReportedIssue({ issue: stock, against: older }, (issue) => issue, older);
		expect(stillReportedIssue(next, newer)).toBeNull();
	});

	it("keeps it lapsed when the updater changes it", () => {
		const next = nextReportedIssue(
			{ issue: stock, against: older },
			(issue) => availabilityIssueForLines(issue, [{ id: "line-b" }]),
			older,
		);
		expect(next?.issue.lineIds).toEqual(["line-b"]);
		expect(stillReportedIssue(next, newer)).toBeNull();
	});
});
