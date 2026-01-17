/**
 * Retry wrapper for fetch. Used in urql client setup (Root.tsx, AuthProvider.tsx).
 * Retries on network errors and 5xx responses with exponential backoff.
 */
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

interface RetryOptions {
	/** Maximum number of retries (default: 2) */
	maxRetries?: number;
	/** Base delay in ms, doubles on each retry (default: 500) */
	baseDelay?: number;
}

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/** Wrap fetch with automatic retry for transient failures (network errors, 5xx). */
export function withRetry(
	baseFetch: FetchFn,
	{ maxRetries = 2, baseDelay = 500 }: RetryOptions = {},
): FetchFn {
	return async (input, init) => {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const response = await baseFetch(input, init);

				// Retry on transient server errors
				if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxRetries) {
					await sleep(baseDelay * Math.pow(2, attempt));
					continue;
				}

				return response;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				// Retry on network errors
				if (attempt < maxRetries) {
					await sleep(baseDelay * Math.pow(2, attempt));
					continue;
				}
			}
		}

		throw lastError ?? new Error("Fetch failed after retries");
	};
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
