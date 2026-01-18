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

/** Format variables for log output (compact, truncated) */
function formatVariablesForLog(variables: Record<string, unknown>): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(variables)) {
		if (value === undefined || value === null) continue;
		const strValue = typeof value === "string" ? value : JSON.stringify(value);
		// Truncate long values
		const truncated = strValue.length > 30 ? strValue.slice(0, 30) + "…" : strValue;
		parts.push(`${key}=${truncated}`);
	}
	return parts.length > 0 ? `(${parts.join(", ")})` : "";
}

// Global queue - shared across all requests
const requestQueue = new RequestQueue(
	parseInt(process.env.SALEOR_MAX_CONCURRENT_REQUESTS || "3", 10),
	parseInt(process.env.SALEOR_MIN_REQUEST_DELAY_MS || "200", 10),
);

/**
 * Get retry configuration.
 * Set NEXT_BUILD_RETRIES for fewer retries during build.
 * Set SALEOR_REQUEST_TIMEOUT_MS for custom timeout (default: 15s).
 */
function getRetryConfig() {
	const buildRetries = process.env.NEXT_BUILD_RETRIES;
	const timeoutMs = parseInt(process.env.SALEOR_REQUEST_TIMEOUT_MS || "15000", 10);

	if (buildRetries !== undefined) {
		return {
			maxRetries: parseInt(buildRetries, 10),
			delayMs: 500,
			timeoutMs,
		};
	}
	return {
		maxRetries: 3,
		delayMs: 1000,
		timeoutMs,
	};
}

/**
 * Fetch with timeout. Throws if request takes longer than timeoutMs.
 */
async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Fetch with retry for 429 (rate limit) and 5xx errors.
 * Used internally by executeGraphQL.
 */
async function fetchWithRetry(
	input: RequestInit,
	withAuth: boolean,
	operationName: string,
	variablesForLog?: string,
): Promise<Response> {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const url = process.env.NEXT_PUBLIC_SALEOR_API_URL;

	const { maxRetries, delayMs, timeoutMs } = getRetryConfig();

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			let response: Response;

			if (withAuth) {
				try {
					// Dynamic import to avoid bundling server-only code in client components
					const { getServerAuthClient } = await import("@/lib/auth/server");
					response = await (await getServerAuthClient()).fetchWithAuth(url, input);
				} catch (authError) {
					// During static generation, cookies() throws - fall back to unauthenticated fetch
					const isDynamicServerError =
						authError instanceof Error &&
						((authError as Error & { digest?: string }).digest === "DYNAMIC_SERVER_USAGE" ||
							authError.message?.includes("cookies") ||
							authError.message?.includes("Dynamic server usage"));
					if (isDynamicServerError) {
						response = await fetchWithTimeout(url, input, timeoutMs);
					} else {
						throw authError;
					}
				}
			} else {
				response = await fetchWithTimeout(url, input, timeoutMs);
			}

			// Retry on 429 (rate limit) or 5xx (server errors)
			if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
				const retryAfter = response.headers.get("Retry-After");
				const retryDelayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : delayMs * Math.pow(2, attempt);
				console.warn(
					`[GraphQL] ${operationName}${variablesForLog ? ` ${variablesForLog}` : ""}: HTTP ${
						response.status
					} - retrying in ${retryDelayMs}ms (attempt ${attempt + 1}/${maxRetries})`,
				);
				await sleep(retryDelayMs);
				continue;
			}

			return response;
		} catch (error) {
			// Timeout or network errors - retry
			const isTimeout = error instanceof Error && error.name === "AbortError";
			if (attempt < maxRetries) {
				const errorType = isTimeout ? `Timeout (>${timeoutMs}ms)` : "Network error";
				console.warn(
					`[GraphQL] ${operationName}${
						variablesForLog ? ` ${variablesForLog}` : ""
					}: ${errorType} - retrying (attempt ${attempt + 1}/${maxRetries})`,
				);
				await sleep(delayMs * Math.pow(2, attempt));
				continue;
			}
			throw new SaleorError(
				`${operationName}: ${isTimeout ? "Request timed out" : "Failed to connect to Saleor API"}`,
				{
					type: "network",
					isRetryable: true,
					cause: error,
				},
			);
		}
	}

	throw new SaleorError(`${operationName}: Max retries exceeded`, { type: "server", isRetryable: false });
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

	// Extract operation name and format variables for logging
	const operationName = operation.toString().match(/(?:query|mutation)\s+(\w+)/)?.[1] || "UnknownOperation";
	const variablesForLog = variables ? formatVariablesForLog(variables) : undefined;

	// Debug logging in development
	if (process.env.NODE_ENV === "development" && process.env.DEBUG_CACHE) {
		console.log(
			`[GraphQL] ${operationName} | cache: ${cache || "default"} | revalidate: ${revalidate || "none"}`,
		);
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
	const response = await requestQueue.enqueue(() =>
		fetchWithRetry(input, withAuth, operationName, variablesForLog),
	);

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
