import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql";

type GraphQLErrorResponse = {
	errors: readonly {
		message: string;
	}[];
};

type GraphQLRespone<T> = { data: T } | GraphQLErrorResponse;

// ============================================================================
// Request Queue for Rate Limiting
// ============================================================================

/**
 * Simple semaphore to limit concurrent API calls.
 * Prevents 429 errors during build when multiple workers fetch simultaneously.
 *
 * Configure via environment variables:
 * - SALEOR_MAX_CONCURRENT_REQUESTS: Max parallel requests (default: 3)
 * - SALEOR_MIN_REQUEST_DELAY_MS: Min delay between requests (default: 300ms)
 */
class RequestQueue {
	private queue: Array<() => void> = [];
	private activeRequests = 0;
	private readonly maxConcurrent: number;
	private readonly minDelayMs: number;

	constructor(maxConcurrent = 3, minDelayMs = 300) {
		this.maxConcurrent = maxConcurrent;
		this.minDelayMs = minDelayMs;
	}

	async enqueue<T>(fn: () => Promise<T>): Promise<T> {
		// Wait for slot
		await this.waitForSlot();

		this.activeRequests++;

		try {
			// Add minimum delay to avoid rate limiting
			const [result] = await Promise.all([fn(), sleep(this.minDelayMs)]);
			return result;
		} finally {
			this.activeRequests--;
			this.processQueue();
		}
	}

	private waitForSlot(): Promise<void> {
		if (this.activeRequests < this.maxConcurrent) {
			return Promise.resolve();
		}
		return new Promise((resolve) => this.queue.push(resolve));
	}

	private processQueue(): void {
		if (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
			const next = this.queue.shift();
			next?.();
		}
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Global queue - shared across all requests
const requestQueue = new RequestQueue(
	parseInt(process.env.SALEOR_MAX_CONCURRENT_REQUESTS || "3", 10),
	parseInt(process.env.SALEOR_MIN_REQUEST_DELAY_MS || "300", 10),
);

/**
 * Detect if we're in build-time static generation.
 * During build, we use shorter timeouts to avoid USE_CACHE_TIMEOUT errors.
 */
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME;

// Use shorter retries during build to avoid `use cache` timeout
const MAX_RETRIES = isBuildTime ? 1 : 3;
const RETRY_DELAY_MS = isBuildTime ? 500 : 1000;

/**
 * Fetch with retry for 429 (rate limit) and 5xx errors.
 * Used internally by executeGraphQL.
 */
async function fetchWithRetry(input: RequestInit, withAuth: boolean): Promise<Response> {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			let response: Response;

			if (withAuth) {
				try {
					// Dynamic import to avoid bundling server-only code in client components
					const { getServerAuthClient } = await import("@/lib/auth/server");
					response = await (
						await getServerAuthClient()
					).fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);
				} catch (authError) {
					// During static generation, cookies() throws - fall back to unauthenticated fetch
					const isDynamicServerError =
						authError instanceof Error &&
						((authError as Error & { digest?: string }).digest === "DYNAMIC_SERVER_USAGE" ||
							authError.message?.includes("cookies") ||
							authError.message?.includes("Dynamic server usage"));
					if (isDynamicServerError) {
						response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);
					} else {
						throw authError;
					}
				}
			} else {
				response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);
			}

			// Retry on 429 (rate limit) or 5xx (server errors)
			if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
				const retryAfter = response.headers.get("Retry-After");
				const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS * Math.pow(2, attempt);
				console.warn(
					`[GraphQL] ${response.status} - retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
				);
				await sleep(delayMs);
				continue;
			}

			return response;
		} catch (error) {
			// Network errors - retry
			if (attempt < MAX_RETRIES) {
				console.warn(`[GraphQL] Network error - retrying (attempt ${attempt + 1}/${MAX_RETRIES})`);
				await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
				continue;
			}
			throw new SaleorError("Failed to connect to Saleor API", {
				type: "network",
				isRetryable: true,
				cause: error,
			});
		}
	}

	throw new SaleorError("Max retries exceeded", { type: "server", isRetryable: false });
}

// ============================================================================
// GraphQL Execution
// ============================================================================

export async function executeGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: {
		headers?: HeadersInit;
		cache?: RequestCache;
		revalidate?: number;
		withAuth?: boolean;
	} & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables }),
): Promise<Result> {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const { variables, headers, cache, revalidate, withAuth = true } = options;

	// Debug logging in development
	if (process.env.NODE_ENV === "development" && process.env.DEBUG_CACHE) {
		const opName = operation.toString().match(/(?:query|mutation)\s+(\w+)/)?.[1] || "unknown";
		console.log(`[GraphQL] ${opName} | cache: ${cache || "default"} | revalidate: ${revalidate || "none"}`);
	}

	const input = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache: cache,
		next: { revalidate },
	};

	// Use queue to limit concurrent requests (prevents 429 during build)
	const response = await requestQueue.enqueue(() => fetchWithRetry(input, withAuth));

	if (!response.ok) {
		const body = await (async () => {
			try {
				return await response.text();
			} catch {
				return "";
			}
		})();
		console.error(input.body);
		throw new HTTPError(response, body);
	}

	const body = (await response.json()) as GraphQLRespone<Result>;

	if ("errors" in body) {
		throw new GraphQLError(body);
	}

	return body.data;
}

export type SaleorErrorType = "network" | "server" | "graphql" | "not_found" | "unauthorized";

export class SaleorError extends Error {
	public readonly type: SaleorErrorType;
	public readonly statusCode?: number;
	public readonly isRetryable: boolean;

	constructor(
		message: string,
		options: {
			type: SaleorErrorType;
			statusCode?: number;
			isRetryable?: boolean;
			cause?: unknown;
		},
	) {
		super(message, { cause: options.cause });
		this.name = "SaleorError";
		this.type = options.type;
		this.statusCode = options.statusCode;
		this.isRetryable = options.isRetryable ?? (options.type === "network" || options.type === "server");
		Object.setPrototypeOf(this, new.target.prototype);
	}

	/** User-friendly message (safe to display) */
	get userMessage(): string {
		switch (this.type) {
			case "network":
				return "Unable to connect to the store. Please check your internet connection.";
			case "server":
				return "The store is temporarily unavailable. Please try again in a moment.";
			case "graphql":
				return "Something went wrong loading this page.";
			case "not_found":
				return "The item you're looking for doesn't exist or has been removed.";
			case "unauthorized":
				return "You don't have permission to view this content.";
			default:
				return "An unexpected error occurred.";
		}
	}
}

class GraphQLError extends SaleorError {
	constructor(public errorResponse: GraphQLErrorResponse) {
		const message = errorResponse.errors.map((error) => error.message).join("\n");
		super(message, { type: "graphql", isRetryable: false });
	}
}

class HTTPError extends SaleorError {
	constructor(response: Response, body: string) {
		const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
		const type: SaleorErrorType =
			response.status === 401 || response.status === 403
				? "unauthorized"
				: response.status === 404
					? "not_found"
					: response.status >= 500
						? "server"
						: "graphql";
		super(message, { type, statusCode: response.status, isRetryable: response.status >= 500 });
	}
}
