import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./auth-rate-limit";

describe("checkRateLimit", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("allows requests under the limit", () => {
		const key = `test:${Date.now()}`;

		expect(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
		expect(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
	});

	it("blocks requests over the limit until the window resets", () => {
		const key = "test:block";

		checkRateLimit(key, { limit: 1, windowMs: 60_000 });
		const blocked = checkRateLimit(key, { limit: 1, windowMs: 60_000 });

		expect(blocked.allowed).toBe(false);
		if (!blocked.allowed) {
			expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
		}

		vi.advanceTimersByTime(60_000);

		expect(checkRateLimit(key, { limit: 1, windowMs: 60_000 }).allowed).toBe(true);
	});
});
