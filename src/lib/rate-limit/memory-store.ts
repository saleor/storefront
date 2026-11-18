import type { Counter, RateLimitStore } from "./store";

/** Above this many keys, expired ones are dropped before a new one is added. */
const PRUNE_ABOVE = 10_000;

/**
 * Counts in this server instance's memory. Right for local development and a single long-running
 * server. On serverless hosting each instance counts on its own and a cold start forgets, so it is
 * only a fallback there.
 */
export function createMemoryStore(now: () => number = Date.now): RateLimitStore {
	const counters = new Map<string, Counter>();

	function current(key: string): Counter | null {
		const counter = counters.get(key);
		if (!counter) return null;
		if (now() >= counter.resetAt) {
			counters.delete(key);
			return null;
		}
		return counter;
	}

	function prune() {
		const time = now();
		for (const [key, counter] of counters) {
			if (time >= counter.resetAt) counters.delete(key);
		}
	}

	return {
		async increment(key, windowMs) {
			const counter = current(key);
			if (counter) {
				counter.count += 1;
				return { ...counter };
			}
			if (counters.size >= PRUNE_ABOVE) prune();
			const fresh = { count: 1, resetAt: now() + windowMs };
			counters.set(key, fresh);
			return { ...fresh };
		},
	};
}
