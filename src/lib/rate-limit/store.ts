/** How many attempts a key has made in its current window, and when that window ends. */
export type Counter = { count: number; resetAt: number };

/**
 * Where attempt counts live. Every server instance must see the same counts, or an attacker
 * spreads guesses across instances (and every cold start forgets them).
 */
export interface RateLimitStore {
	/** Add one attempt to `key`, starting a window of `windowMs` when none is running. */
	increment(key: string, windowMs: number): Promise<Counter>;
}

/** The store did not answer, or answered with something unusable. */
export class RateLimitStoreError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = "RateLimitStoreError";
	}
}
