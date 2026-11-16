import { describe, expect, it } from "vitest";
import { planRepeatOrder } from "@/lib/custom/buy-again";

describe("planRepeatOrder", () => {
	it("adds prior quantities without replacing an existing bag", () => {
		expect(
			planRepeatOrder(
				[{ variantId: "a", quantity: 2 }],
				new Map([["a", 10]]),
				new Map([
					["a", 3],
					["b", 1],
				]),
			),
		).toEqual({ lines: [{ variantId: "a", quantity: 2 }], added: 2, skipped: 0 });
	});
	it("skips deleted, unpublished and sold out variants", () => {
		expect(
			planRepeatOrder(
				[
					{ variantId: null, quantity: 1 },
					{ variantId: "missing", quantity: 2 },
					{ variantId: "sold", quantity: 1 },
				],
				new Map([["sold", 0]]),
				new Map(),
			),
		).toEqual({ lines: [], added: 0, skipped: 4 });
	});
	it("caps quantities after accounting for stock already in the bag", () => {
		expect(
			planRepeatOrder([{ variantId: "a", quantity: 5 }], new Map([["a", 4]]), new Map([["a", 2]])),
		).toEqual({ lines: [{ variantId: "a", quantity: 2 }], added: 2, skipped: 3 });
	});
	it("aggregates duplicate variant lines before checking stock", () => {
		expect(
			planRepeatOrder(
				[
					{ variantId: "a", quantity: 2 },
					{ variantId: "a", quantity: 3 },
				],
				new Map([["a", 4]]),
				new Map(),
			),
		).toEqual({ lines: [{ variantId: "a", quantity: 4 }], added: 4, skipped: 1 });
	});
	it("does not subtract items when the existing bag exceeds stock", () => {
		expect(
			planRepeatOrder([{ variantId: "a", quantity: 1 }], new Map([["a", 1]]), new Map([["a", 2]])),
		).toEqual({ lines: [], added: 0, skipped: 1 });
	});
});
