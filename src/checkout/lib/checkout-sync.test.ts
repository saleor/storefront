import { describe, expect, it } from "vitest";

import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import {
	adoptCheckoutSnapshot,
	checkoutsHaveSameLines,
	checkoutLinesSignature,
	needsCheckoutEntrySync,
	resolveSessionCheckout,
} from "@/checkout/lib/checkout-sync";

function makeCheckout(lines: Array<{ id: string; quantity: number }>): ServerCheckout {
	return {
		id: "checkout-1",
		lines: lines.map((line) => ({
			id: line.id,
			quantity: line.quantity,
		})),
	} as ServerCheckout;
}

describe("checkoutLinesSignature", () => {
	it("returns empty string for empty cart", () => {
		expect(checkoutLinesSignature(makeCheckout([]))).toBe("");
	});

	it("is order-independent", () => {
		const a = makeCheckout([
			{ id: "line-b", quantity: 1 },
			{ id: "line-a", quantity: 2 },
		]);
		const b = makeCheckout([
			{ id: "line-a", quantity: 2 },
			{ id: "line-b", quantity: 1 },
		]);

		expect(checkoutLinesSignature(a)).toBe(checkoutLinesSignature(b));
	});
});

describe("adoptCheckoutSnapshot", () => {
	it("keeps client when only non-line fields differ", () => {
		const client = {
			...makeCheckout([{ id: "line-a", quantity: 1 }]),
			email: "client@example.com",
		} as ServerCheckout;
		const server = {
			...makeCheckout([{ id: "line-a", quantity: 1 }]),
			email: "server@example.com",
		} as ServerCheckout;

		expect(adoptCheckoutSnapshot(client, server)).toBe(client);
	});

	it("adopts server when lines changed", () => {
		const client = makeCheckout([{ id: "line-a", quantity: 2 }]);
		const server = makeCheckout([{ id: "line-a", quantity: 1 }]);

		expect(adoptCheckoutSnapshot(client, server)).toBe(server);
	});
});

describe("resolveSessionCheckout", () => {
	it("hides checkout when session id does not match", () => {
		const stale = { ...makeCheckout([{ id: "line-a", quantity: 1 }]), id: "old-checkout" } as ServerCheckout;

		expect(resolveSessionCheckout(stale, "new-checkout", "ready")).toBeNull();
	});

	it("returns checkout when session id matches", () => {
		const current = makeCheckout([{ id: "line-a", quantity: 1 }]);

		expect(resolveSessionCheckout(current, "checkout-1", "ready")).toBe(current);
	});

	it("returns null when load state is not ready", () => {
		const current = makeCheckout([{ id: "line-a", quantity: 1 }]);

		expect(resolveSessionCheckout(current, "checkout-1", "none")).toBeNull();
	});
});

describe("needsCheckoutEntrySync", () => {
	it("returns false when load state is not ready", () => {
		expect(needsCheckoutEntrySync("checkout-1", "empty", makeCheckout([{ id: "line-a", quantity: 1 }]))).toBe(
			false,
		);
	});

	it("returns true when ready but initial snapshot is missing", () => {
		expect(needsCheckoutEntrySync("checkout-1", "ready", null)).toBe(true);
	});

	it("returns true when initial snapshot id does not match session", () => {
		const initial = { ...makeCheckout([{ id: "line-a", quantity: 1 }]), id: "other" } as ServerCheckout;

		expect(needsCheckoutEntrySync("checkout-1", "ready", initial)).toBe(true);
	});

	it("returns false when ready with matching hydrated snapshot", () => {
		const initial = makeCheckout([{ id: "line-a", quantity: 1 }]);

		expect(needsCheckoutEntrySync("checkout-1", "ready", initial)).toBe(false);
	});
});

describe("checkoutsHaveSameLines", () => {
	it("detects added lines", () => {
		const before = makeCheckout([{ id: "line-a", quantity: 1 }]);
		const after = makeCheckout([
			{ id: "line-a", quantity: 1 },
			{ id: "line-b", quantity: 1 },
		]);

		expect(checkoutsHaveSameLines(before, after)).toBe(false);
	});

	it("detects quantity changes", () => {
		const before = makeCheckout([{ id: "line-a", quantity: 1 }]);
		const after = makeCheckout([{ id: "line-a", quantity: 2 }]);

		expect(checkoutsHaveSameLines(before, after)).toBe(false);
	});
});
