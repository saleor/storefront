import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	canEnforceStrictLimits,
	consumeAttempt,
	consumeAttempts,
	redisRestConfigFromEnv,
	warnIfRateLimitsArePerInstance,
} from "./limiter";

const limit = { limit: 2, windowMs: 60_000 };
let n = 0;
const freshKey = () => `test:${++n}:${Math.random()}`;

beforeEach(() => {
	vi.spyOn(console, "warn").mockImplementation(() => {});
	for (const name of [
		"RATE_LIMIT_STORE",
		"RATE_LIMIT_REDIS_REST_URL",
		"RATE_LIMIT_REDIS_REST_TOKEN",
		"UPSTASH_REDIS_REST_URL",
		"UPSTASH_REDIS_REST_TOKEN",
		"KV_REST_API_URL",
		"KV_REST_API_TOKEN",
	]) {
		vi.stubEnv(name, "");
	}
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("redisRestConfigFromEnv", () => {
	it("prefers Paper's names, then Upstash's, then the Vercel Marketplace's", () => {
		expect(redisRestConfigFromEnv({ KV_REST_API_URL: "kv", KV_REST_API_TOKEN: "t" })).toEqual({
			url: "kv",
			token: "t",
		});
		expect(
			redisRestConfigFromEnv({
				RATE_LIMIT_REDIS_REST_URL: "own",
				RATE_LIMIT_REDIS_REST_TOKEN: "a",
				UPSTASH_REDIS_REST_URL: "upstash",
				UPSTASH_REDIS_REST_TOKEN: "b",
			}),
		).toEqual({ url: "own", token: "a" });
		expect(redisRestConfigFromEnv({ UPSTASH_REDIS_REST_URL: "half" })).toBeNull();
	});
});

describe("canEnforceStrictLimits", () => {
	it("is false only when the deployment requires a store and has none", () => {
		expect(canEnforceStrictLimits({ NODE_ENV: "production" })).toBe(true);
		expect(canEnforceStrictLimits({ NODE_ENV: "production", RATE_LIMIT_STORE: "required" })).toBe(false);
		expect(
			canEnforceStrictLimits({
				NODE_ENV: "production",
				RATE_LIMIT_STORE: "required",
				KV_REST_API_URL: "u",
				KV_REST_API_TOKEN: "t",
			}),
		).toBe(true);
	});
});

describe("warnIfRateLimitsArePerInstance", () => {
	it("tells production without a store to connect Redis, and stays quiet otherwise", () => {
		warnIfRateLimitsArePerInstance({ NODE_ENV: "production" });
		expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/per server instance.*Upstash Redis/));

		vi.mocked(console.warn).mockClear();
		warnIfRateLimitsArePerInstance({ NODE_ENV: "development" });
		warnIfRateLimitsArePerInstance({ NODE_ENV: "production", KV_REST_API_URL: "u", KV_REST_API_TOKEN: "t" });
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("says lookups are refused when a store is required but missing", () => {
		warnIfRateLimitsArePerInstance({ NODE_ENV: "production", RATE_LIMIT_STORE: "required" });
		expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/guest order lookups are refused/));
	});
});

describe("without a store, in development", () => {
	it("counts in memory: `limit` attempts pass, the next is refused with a wait", async () => {
		vi.stubEnv("NODE_ENV", "development");
		const key = freshKey();
		expect(await consumeAttempt(key, limit, "strict")).toEqual({ ok: true });
		expect(await consumeAttempt(key, limit, "strict")).toEqual({ ok: true });
		const third = await consumeAttempt(key, limit, "strict");
		expect(third).toMatchObject({ ok: false, reason: "limited" });
		expect(third.ok === false && third.reason === "limited" && third.retryAfterSeconds).toBeGreaterThan(0);
	});

	it("lets only `limit` of many parallel attempts through", async () => {
		vi.stubEnv("NODE_ENV", "development");
		const key = freshKey();
		const outcomes = await Promise.all(
			Array.from({ length: 10 }, () => consumeAttempt(key, limit, "strict")),
		);
		expect(outcomes.filter((outcome) => outcome.ok)).toHaveLength(2);
	});
});

describe("without a store, in production", () => {
	it("counts in this instance's memory", async () => {
		vi.stubEnv("NODE_ENV", "production");
		const key = freshKey();
		await consumeAttempt(key, limit, "strict");
		await consumeAttempt(key, limit, "strict");
		expect(await consumeAttempt(key, limit, "strict")).toMatchObject({ ok: false, reason: "limited" });
	});

	it("refuses strict attempts when the deployment requires a store, but keeps sign-in counting", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("RATE_LIMIT_STORE", "required");
		expect(await consumeAttempt(freshKey(), limit, "strict")).toEqual({ ok: false, reason: "unavailable" });
		expect(await consumeAttempt(freshKey(), limit, "memory")).toEqual({ ok: true });
	});
});

describe("with a shared store", () => {
	beforeEach(() => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("RATE_LIMIT_REDIS_REST_URL", "https://redis.example.test");
		vi.stubEnv("RATE_LIMIT_REDIS_REST_TOKEN", "token");
	});

	it("uses the count it answers with", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(JSON.stringify({ result: [1, 30_000] }))),
		);
		expect(await consumeAttempt(freshKey(), limit, "strict")).toEqual({ ok: true });
	});

	it("stops asking the store about a key that is over its limit until its window ends", async () => {
		const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: [3, 30_000] })));
		vi.stubGlobal("fetch", fetchMock);
		const key = freshKey();
		expect(await consumeAttempt(key, limit, "strict")).toMatchObject({ ok: false, reason: "limited" });
		expect(await consumeAttempt(key, limit, "strict")).toMatchObject({ ok: false, reason: "limited" });
		expect(await consumeAttempt(key, limit, "memory")).toMatchObject({ ok: false, reason: "limited" });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("counts in memory when it does not answer, unless a store is required, and says so in the logs", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new TypeError("fetch failed");
			}),
		);
		expect(await consumeAttempt(freshKey(), limit, "strict")).toEqual({ ok: true });
		expect(console.warn).toHaveBeenCalled();

		vi.stubEnv("RATE_LIMIT_STORE", "required");
		expect(await consumeAttempt(freshKey(), limit, "strict")).toEqual({ ok: false, reason: "unavailable" });
		expect(await consumeAttempt(freshKey(), limit, "memory")).toEqual({ ok: true });
	});
});

describe("consumeAttempts", () => {
	it("counts every key and reports the first refusal", async () => {
		vi.stubEnv("NODE_ENV", "development");
		const tight = freshKey();
		const loose = freshKey();
		await consumeAttempt(tight, { limit: 1, windowMs: 60_000 }, "strict");
		const outcome = await consumeAttempts(
			[
				{ key: loose, limit },
				{ key: tight, limit: { limit: 1, windowMs: 60_000 } },
			],
			"strict",
		);
		expect(outcome).toMatchObject({ ok: false, reason: "limited" });
		// The loose key was still counted.
		await consumeAttempt(loose, limit, "strict");
		expect(await consumeAttempt(loose, limit, "strict")).toMatchObject({ ok: false });
	});
});
