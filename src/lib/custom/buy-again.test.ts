import { describe, expect, it } from "vitest";
import { planBuyAgain } from "./buy-again";

describe("planBuyAgain", () => {
	it("keeps original quantities and skips removed or sold-out variants", () => {
		expect(
			planBuyAgain(
				[
					{ variantId: "available", quantity: 2 },
					{ variantId: "sold-out", quantity: 1 },
					{ variantId: "removed", quantity: 1 },
				],
				[
					{ id: "available", available: 8 },
					{ id: "sold-out", available: 0 },
				],
				[],
			),
		).toEqual({ lines: [{ variantId: "available", quantity: 2 }], skipped: 2 });
	});
	it("caps quantities after accounting for every matching cart line", () => {
		expect(
			planBuyAgain(
				[{ variantId: "a", quantity: 4 }],
				[{ id: "a", available: 5 }],
				[
					{ variantId: "a", quantity: 2 },
					{ variantId: "a", quantity: 1 },
				],
			),
		).toEqual({ lines: [{ variantId: "a", quantity: 2 }], skipped: 2 });
	});
	it("merges duplicate variants without exceeding stock", () => {
		expect(
			planBuyAgain(
				[
					{ variantId: "a", quantity: 2 },
					{ variantId: "a", quantity: 3 },
				],
				[{ id: "a", available: 4 }],
				[],
			),
		).toEqual({ lines: [{ variantId: "a", quantity: 4 }], skipped: 1 });
	});
	it("does not reduce or replace an existing cart", () => {
		expect(
			planBuyAgain(
				[{ variantId: "a", quantity: 1 }],
				[{ id: "a", available: 1 }],
				[{ variantId: "a", quantity: 2 }],
			),
		).toEqual({ lines: [], skipped: 1 });
	});
});
