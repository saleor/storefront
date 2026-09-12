import { describe, expect, it } from "vitest";
import { claimBeginCheckout, claimOnce, claimSearchView } from "./claim";

function memoryStorage(initial: Record<string, string> = {}) {
	const data = { ...initial };
	return {
		getItem: (key: string) => data[key] ?? null,
		setItem: (key: string, value: string) => {
			data[key] = value;
		},
	};
}

describe("claimOnce", () => {
	it("treats a throwing store as a miss so effects never blow up", () => {
		const storage = {
			getItem: () => {
				throw new Error("SecurityError");
			},
			setItem: () => {
				throw new Error("SecurityError");
			},
		};
		expect(claimOnce("k", storage)).toBe(false);
	});
});

describe("claimBeginCheckout", () => {
	it("allows the first claim for a checkout id and rejects the next", () => {
		const storage = memoryStorage();
		expect(claimBeginCheckout("Q2hlY2tvdXQ6MQ==", storage)).toBe(true);
		expect(claimBeginCheckout("Q2hlY2tvdXQ6MQ==", storage)).toBe(false);
	});

	it("treats a different checkout as a new start", () => {
		const storage = memoryStorage();
		expect(claimBeginCheckout("one", storage)).toBe(true);
		expect(claimBeginCheckout("two", storage)).toBe(true);
	});

	it("does not claim when storage is missing (SSR / blocked)", () => {
		expect(claimBeginCheckout("Q2hlY2tvdXQ6MQ==", null)).toBe(false);
	});

	it("does not claim an empty id", () => {
		expect(claimBeginCheckout("", memoryStorage())).toBe(false);
	});
});

describe("claimSearchView", () => {
	it("dedups the same results URL (Strict Mode remount / sort-stable)", () => {
		const storage = memoryStorage();
		const href = "/en/us/search?query=q";
		expect(claimSearchView(href, storage)).toBe(true);
		expect(claimSearchView(href, storage)).toBe(false);
	});
});
