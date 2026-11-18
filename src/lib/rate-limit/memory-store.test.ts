import { describe, expect, it } from "vitest";

import { createMemoryStore } from "./memory-store";

describe("createMemoryStore", () => {
	it("counts attempts within a window and starts over after it", async () => {
		let time = 1_000;
		const store = createMemoryStore(() => time);

		expect(await store.increment("k", 60_000)).toEqual({ count: 1, resetAt: 61_000 });
		expect(await store.increment("k", 60_000)).toEqual({ count: 2, resetAt: 61_000 });

		time = 61_000;
		expect(await store.increment("k", 60_000)).toEqual({ count: 1, resetAt: 121_000 });
	});

	it("keeps keys apart", async () => {
		const store = createMemoryStore(() => 0);
		await store.increment("a", 1_000);
		expect((await store.increment("b", 1_000)).count).toBe(1);
	});

	it("hands out copies, so callers cannot change a stored count", async () => {
		const store = createMemoryStore(() => 0);
		const counter = await store.increment("k", 1_000);
		counter.count = 99;
		expect((await store.increment("k", 1_000)).count).toBe(2);
	});
});
