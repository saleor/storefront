import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ACCOUNT_LIMITS, rejectIfAccountLimited, rejectIfRateLimited } from "./auth-rate-limit";

let n = 0;
const fromIp = (ip: string) =>
	new Request("https://shop.example.test/api/auth/login", { headers: { "x-forwarded-for": ip } });
const freshEmail = () => `shopper-${++n}-${Math.random()}@example.com`;

beforeEach(() => {
	// No shared store configured: development counts in memory.
	vi.stubEnv("NODE_ENV", "development");
	vi.stubEnv("RATE_LIMIT_REDIS_REST_URL", "");
	vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
	vi.stubEnv("KV_REST_API_URL", "");
});

afterEach(() => {
	vi.unstubAllEnvs();
});

describe("rejectIfRateLimited", () => {
	it("allows requests under the limit and answers 429 with Retry-After over it", async () => {
		const ip = `198.51.100.${++n % 250}`;
		const limit = { limit: 2, windowMs: 60_000 };
		expect(await rejectIfRateLimited(fromIp(ip), "login", limit)).toBeNull();
		expect(await rejectIfRateLimited(fromIp(ip), "login", limit)).toBeNull();

		const blocked = await rejectIfRateLimited(fromIp(ip), "login", limit);
		expect(blocked?.status).toBe(429);
		expect(Number(blocked?.headers.get("Retry-After"))).toBeGreaterThan(0);
	});

	it("counts each route separately", async () => {
		const ip = `203.0.113.${++n % 250}`;
		const limit = { limit: 1, windowMs: 60_000 };
		expect(await rejectIfRateLimited(fromIp(ip), "login", limit)).toBeNull();
		expect(await rejectIfRateLimited(fromIp(ip), "register", limit)).toBeNull();
	});
});

describe("rejectIfAccountLimited", () => {
	it("limits sign-in attempts per account, whatever the IP, and above one IP's budget", async () => {
		expect(ACCOUNT_LIMITS.login.limit).toBeGreaterThan(10);
		const email = freshEmail();
		for (let i = 0; i < ACCOUNT_LIMITS.login.limit; i++) {
			expect(await rejectIfAccountLimited("login", email)).toBeNull();
		}
		expect((await rejectIfAccountLimited("login", email))?.status).toBe(429);
		// The same account with different case and spacing shares the counter.
		expect((await rejectIfAccountLimited("login", `  ${email.toUpperCase()} `))?.status).toBe(429);
		expect(await rejectIfAccountLimited("login", freshEmail())).toBeNull();
	});

	it("limits reset emails per account, separately from sign-in", async () => {
		const email = freshEmail();
		for (let i = 0; i < ACCOUNT_LIMITS["reset-password"].limit; i++) {
			expect(await rejectIfAccountLimited("reset-password", email)).toBeNull();
		}
		expect((await rejectIfAccountLimited("reset-password", email))?.status).toBe(429);
		expect(await rejectIfAccountLimited("login", email)).toBeNull();
	});
});
