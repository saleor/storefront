import { RateLimitStoreError, type RateLimitStore } from "./store";

/** Keeps Paper's counters apart from anything else in a shared Redis. */
const KEY_PREFIX = "paper:rl:";
const TIMEOUT_MS = 2_000;

/**
 * One atomic step: add an attempt, and start the window if the key has none (a new key, or one
 * whose expiry was lost). Returns the count and the milliseconds left in the window.
 */
const INCREMENT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('PTTL', KEYS[1])
if ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return {count, ttl}
`;

export type RedisRestConfig = { url: string; token: string };

/**
 * Counts in Redis over the Upstash REST protocol: Upstash itself (the Vercel Marketplace's Redis),
 * or any Redis behind a compatible REST proxy when self-hosting.
 */
export function createRedisRestStore(
	{ url, token }: RedisRestConfig,
	{ fetchImpl = fetch, now = Date.now }: { fetchImpl?: typeof fetch; now?: () => number } = {},
): RateLimitStore {
	async function evalScript(script: string, key: string, args: string[]): Promise<[number, number]> {
		let response: Response;
		try {
			response = await fetchImpl(url, {
				method: "POST",
				headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
				body: JSON.stringify(["EVAL", script, "1", `${KEY_PREFIX}${key}`, ...args]),
				cache: "no-store",
				signal: AbortSignal.timeout(TIMEOUT_MS),
			});
		} catch (error) {
			throw new RateLimitStoreError("Rate-limit store did not answer", { cause: error });
		}

		const body = (await response.json().catch(() => null)) as { result?: unknown; error?: unknown } | null;
		const result = body?.result;
		if (
			!response.ok ||
			!Array.isArray(result) ||
			typeof result[0] !== "number" ||
			typeof result[1] !== "number"
		) {
			const reason = typeof body?.error === "string" ? body.error : `HTTP ${response.status}`;
			throw new RateLimitStoreError(`Rate-limit store refused the request: ${reason}`);
		}
		return [result[0], result[1]];
	}

	return {
		async increment(key, windowMs) {
			const [count, ttl] = await evalScript(INCREMENT_SCRIPT, key, [String(windowMs)]);
			return { count, resetAt: now() + Math.max(ttl, 0) };
		},
	};
}
