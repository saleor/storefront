import { createMemoryStore } from "./memory-store";
import { createRedisRestStore, type RedisRestConfig } from "./redis-rest-store";
import { RateLimitStoreError, type Counter, type RateLimitStore } from "./store";

/** At most `limit` attempts per `windowMs`. */
export type Limit = { limit: number; windowMs: number };

/**
 * What to do when no shared store is configured, or it does not answer:
 * - `memory`: count in this instance's memory instead. Sign-in always does, so it never stops.
 * - `strict`: the same, unless the deployment set `RATE_LIMIT_STORE=required`; then refuse. For
 *   guest order lookup, whose number search runs with an app token that can read every order.
 */
export type WhenStoreFails = "memory" | "strict";

export type LimitOutcome =
	| { ok: true }
	| { ok: false; reason: "limited"; retryAfterSeconds: number }
	| { ok: false; reason: "unavailable" };

type Env = Readonly<Record<string, string | undefined>>;

/** Env pairs read in order: Paper's own names, then the names Upstash and the Vercel Marketplace set. */
const REDIS_ENV_PAIRS = [
	["RATE_LIMIT_REDIS_REST_URL", "RATE_LIMIT_REDIS_REST_TOKEN"],
	["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
	["KV_REST_API_URL", "KV_REST_API_TOKEN"],
] as const;

export function redisRestConfigFromEnv(env: Env = process.env): RedisRestConfig | null {
	for (const [urlName, tokenName] of REDIS_ENV_PAIRS) {
		const url = env[urlName]?.trim();
		const token = env[tokenName]?.trim();
		if (url && token) return { url, token };
	}
	return null;
}

/** `RATE_LIMIT_STORE=required`: refuse guest order lookups rather than count them per instance. */
export function storeRequired(env: Env = process.env): boolean {
	return env.RATE_LIMIT_STORE?.trim().toLowerCase() === "required";
}

/** Whether `strict` limits can work here: a shared store, or no requirement for one. */
export function canEnforceStrictLimits(env: Env = process.env): boolean {
	return Boolean(redisRestConfigFromEnv(env)) || !storeRequired(env);
}

let memoryStore: RateLimitStore | undefined;
function instanceMemory(): RateLimitStore {
	return (memoryStore ??= createMemoryStore());
}

const PER_INSTANCE =
	"Rate limits are counted per server instance: serverless hosting multiplies them and cold starts reset them. " +
	"For production, connect Upstash Redis (Vercel Marketplace) or set RATE_LIMIT_REDIS_REST_URL and " +
	"RATE_LIMIT_REDIS_REST_TOKEN; see .env.example.";
const REQUIRED_MISSING =
	"RATE_LIMIT_STORE=required, but no rate-limit store is configured: guest order lookups are refused. " +
	"Set RATE_LIMIT_REDIS_REST_URL and RATE_LIMIT_REDIS_REST_TOKEN; see .env.example.";

function missingStoreMessage(env: Env = process.env): string {
	return storeRequired(env) ? REQUIRED_MISSING : PER_INSTANCE;
}

/** Called once per server start (src/instrumentation.ts): production without a store says so. */
export function warnIfRateLimitsArePerInstance(env: Env = process.env): void {
	if (env.NODE_ENV === "production" && !redisRestConfigFromEnv(env)) {
		console.warn(`[rate-limit] ${missingStoreMessage(env)}`);
	}
}

const WARN_EVERY_MS = 60_000;
const lastWarned = new Map<string, number>();
/** Repeats at most once a minute, so a lasting outage stays visible in the logs. */
function warn(message: string, error?: unknown) {
	const now = Date.now();
	if (now - (lastWarned.get(message) ?? 0) < WARN_EVERY_MS) return;
	lastWarned.set(message, now);
	console.warn(`[rate-limit] ${message}`, error instanceof Error ? error.message : "");
}

/*
 * Keys over their limit, remembered by this instance until their window ends. Repeat attempts are
 * then refused without asking the store, so hammering a blocked key costs the store nothing and
 * cannot be used to exhaust its quota (and force the fallback).
 */
const BLOCKED_PRUNE_ABOVE = 10_000;
const blockedUntil = new Map<string, number>();

function rememberBlocked(key: string, resetAt: number) {
	if (blockedUntil.size >= BLOCKED_PRUNE_ABOVE) {
		const now = Date.now();
		for (const [blockedKey, until] of blockedUntil) {
			if (until <= now) blockedUntil.delete(blockedKey);
		}
	}
	blockedUntil.set(key, resetAt);
}

function limited(resetAt: number): LimitOutcome {
	return {
		ok: false,
		reason: "limited",
		retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
	};
}

async function increment(key: string, windowMs: number, whenStoreFails: WhenStoreFails) {
	const redis = redisRestConfigFromEnv();
	if (redis) {
		try {
			return await createRedisRestStore(redis).increment(key, windowMs);
		} catch (error) {
			if (!(error instanceof RateLimitStoreError)) throw error;
			warn("The rate-limit store failed; limits are counted per server instance until it answers.", error);
		}
	} else if (process.env.NODE_ENV === "production") {
		warn(missingStoreMessage());
	}
	if (whenStoreFails === "strict" && storeRequired()) return null;
	return instanceMemory().increment(key, windowMs);
}

/**
 * Count this attempt against `key` before doing the work it guards, and refuse it once the window
 * holds more than `limit`. Counting first is what keeps parallel attempts from all getting through:
 * every attempt, right or wrong, takes a place in the window atomically.
 */
export async function consumeAttempt(
	key: string,
	{ limit, windowMs }: Limit,
	whenStoreFails: WhenStoreFails,
): Promise<LimitOutcome> {
	const until = blockedUntil.get(key);
	if (until !== undefined) {
		if (until > Date.now()) return limited(until);
		blockedUntil.delete(key);
	}

	const counter: Counter | null = await increment(key, windowMs, whenStoreFails);
	if (!counter) return { ok: false, reason: "unavailable" };
	if (counter.count <= limit) return { ok: true };
	rememberBlocked(key, counter.resetAt);
	return limited(counter.resetAt);
}

/** Several limits for one attempt: every key is counted, and the first refusal wins. */
export async function consumeAttempts(
	attempts: ReadonlyArray<{ key: string; limit: Limit }>,
	whenStoreFails: WhenStoreFails,
): Promise<LimitOutcome> {
	const outcomes = await Promise.all(
		attempts.map(({ key, limit }) => consumeAttempt(key, limit, whenStoreFails)),
	);
	return (
		outcomes.find((outcome) => !outcome.ok && outcome.reason === "unavailable") ??
		outcomes.find((outcome) => !outcome.ok) ?? { ok: true }
	);
}
