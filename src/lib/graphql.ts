import { type TypedDocumentString } from "../gql/graphql";

// ============================================================================
// Result Types - Explicit error handling without exceptions
// ============================================================================

/**
 * Error layers in order of occurrence:
 * 1. network - Failed to reach server (timeout, DNS, connection refused)
 * 2. http - Server responded with error status (4xx, 5xx)
 * 3. graphql - Query/mutation syntax or validation errors
 * 4. validation - Saleor domain errors (e.g., "email already exists")
 */
export type GraphQLErrorType = "network" | "http" | "graphql" | "validation";

export interface GraphQLError {
	type: GraphQLErrorType;
	message: string;
	/** HTTP status code (only for 'http' type) */
	statusCode?: number;
	/** Whether the request could succeed if retried */
	isRetryable: boolean;
	/** Original error for debugging */
	cause?: unknown;
	/** Saleor validation errors with field info (only for 'validation' type) */
	validationErrors?: ReadonlyArray<{
		field?: string | null;
		message: string;
		code?: string | null;
	}>;
}

/** Success result with data */
export interface GraphQLSuccess<T> {
	ok: true;
	data: T;
}

/** Error result with typed error */
export interface GraphQLFailure {
	ok: false;
	error: GraphQLError;
}

/** Result type - either success with data or failure with error */
export type GraphQLResult<T> = GraphQLSuccess<T> | GraphQLFailure;

// ============================================================================
// Helper functions
// ============================================================================

function networkError(message: string, cause?: unknown): GraphQLFailure {
	return {
		ok: false,
		error: { type: "network", message, isRetryable: true, cause },
	};
}

function httpError(statusCode: number, message: string): GraphQLFailure {
	return {
		ok: false,
		error: {
			type: "http",
			message,
			statusCode,
			isRetryable: statusCode >= 500 || statusCode === 429,
		},
	};
}

function graphqlError(messages: string[]): GraphQLFailure {
	return {
		ok: false,
		error: {
			type: "graphql",
			message: messages.join("\n"),
			isRetryable: false,
		},
	};
}

function validationError(
	errors: ReadonlyArray<{ field?: string | null; message: string; code?: string | null }>,
): GraphQLFailure {
	return {
		ok: false,
		error: {
			type: "validation",
			message: errors.map((e) => e.message).join(", "),
			isRetryable: false,
			validationErrors: errors,
		},
	};
}

function success<T>(data: T): GraphQLSuccess<T> {
	return { ok: true, data };
}

/** User-friendly message for each error type */
export function getUserMessage(error: GraphQLError): string {
	switch (error.type) {
		case "network":
			return "Unable to connect to the store. Please check your internet connection.";
		case "http":
			if (error.statusCode === 401 || error.statusCode === 403) {
				return "You don't have permission to view this content.";
			}
			if (error.statusCode === 404) {
				return "The item you're looking for doesn't exist or has been removed.";
			}
			return "The store is temporarily unavailable. Please try again in a moment.";
		case "graphql":
			return "Something went wrong loading this page.";
		case "validation":
			return error.message || "Please check your input and try again.";
	}
}

// ============================================================================
// Request Queue for Rate Limiting
// ============================================================================

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
		await this.waitForSlot();
		this.activeRequests++;

		try {
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

function formatVariablesForLog(variables: Record<string, unknown>): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(variables)) {
		if (value === undefined || value === null) continue;
		const strValue = typeof value === "string" ? value : JSON.stringify(value);
		const truncated = strValue.length > 30 ? strValue.slice(0, 30) + "…" : strValue;
		parts.push(`${key}=${truncated}`);
	}
	return parts.length > 0 ? `(${parts.join(", ")})` : "";
}

const requestQueue = new RequestQueue(
	parseInt(process.env.SALEOR_MAX_CONCURRENT_REQUESTS || "3", 10),
	parseInt(process.env.SALEOR_MIN_REQUEST_DELAY_MS || "200", 10),
);

function getRetryConfig() {
	const buildRetries = process.env.NEXT_BUILD_RETRIES;
	const timeoutMs = parseInt(process.env.SALEOR_REQUEST_TIMEOUT_MS || "15000", 10);

	if (buildRetries !== undefined) {
		return { maxRetries: parseInt(buildRetries, 10), delayMs: 500, timeoutMs };
	}
	return { maxRetries: 3, delayMs: 1000, timeoutMs };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timeoutId);
	}
}

// ============================================================================
// Core Fetch with Retry
// ============================================================================

type FetchResult = GraphQLSuccess<Response> | GraphQLFailure;

async function fetchWithRetry(
	input: RequestInit,
	withAuth: boolean,
	operationName: string,
	variablesForLog?: string,
): Promise<FetchResult> {
	const url = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (!url) {
		return networkError("Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	}

	const { maxRetries, delayMs, timeoutMs } = getRetryConfig();

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			let response: Response;

			if (withAuth) {
				try {
					const { getServerAuthClient } = await import("@/lib/auth/server");
					response = await (await getServerAuthClient()).fetchWithAuth(url, input);
				} catch (authError) {
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

			return success(response);
		} catch (error) {
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
			return networkError(
				`${operationName}: ${isTimeout ? "Request timed out" : "Failed to connect to Saleor API"}`,
				error,
			);
		}
	}

	return networkError(`${operationName}: Max retries exceeded`);
}

// ============================================================================
// GraphQL Execution
// ============================================================================

type GraphQLOptions<Variables> = {
	headers?: HeadersInit;
	cache?: RequestCache;
	revalidate?: number;
} & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables });

type GraphQLResponse<T> = { data: T } | { errors: readonly { message: string }[] };

/**
 * Internal base GraphQL executor. Returns a Result type.
 */
async function executeGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: GraphQLOptions<Variables> & { withAuth: boolean },
): Promise<GraphQLResult<Result>> {
	const { variables, headers, cache, revalidate, withAuth } = options;

	const operationName = operation.toString().match(/(?:query|mutation)\s+(\w+)/)?.[1] || "UnknownOperation";
	const variablesForLog = variables ? formatVariablesForLog(variables) : undefined;

	if (process.env.NODE_ENV === "development" && process.env.DEBUG_CACHE) {
		console.log(
			`[GraphQL] ${operationName} | cache: ${cache || "default"} | revalidate: ${revalidate || "none"}`,
		);
	}

	const input = {
		method: "POST",
		headers: { "Content-Type": "application/json", ...headers },
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache,
		next: { revalidate },
	};

	const fetchResult = await requestQueue.enqueue(() =>
		fetchWithRetry(input, withAuth, operationName, variablesForLog),
	);

	if (!fetchResult.ok) {
		return fetchResult;
	}

	const response = fetchResult.data;

	if (!response.ok) {
		const body = await response.text().catch(() => "");
		return httpError(response.status, `HTTP ${response.status}: ${response.statusText}\n${body}`);
	}

	const body = (await response.json()) as GraphQLResponse<Result>;

	if ("errors" in body) {
		return graphqlError(body.errors.map((e) => e.message));
	}

	return success(body.data);
}

/**
 * Execute a GraphQL query for public data (no user authentication).
 *
 * Use this for:
 * - Product queries (listings, details, search)
 * - Category/collection queries
 * - Menu queries
 * - Any public storefront data
 *
 * Returns a Result type - check `result.ok` before accessing `result.data`.
 */
export async function executePublicGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: GraphQLOptions<Variables>,
): Promise<GraphQLResult<Result>> {
	return executeGraphQL(operation, { ...options, withAuth: false });
}

/**
 * Execute a GraphQL query/mutation with user authentication.
 *
 * Use this for:
 * - CurrentUser queries (me, orders, addresses)
 * - Checkout mutations (add to cart, update lines)
 * - Any query that returns user-specific data
 *
 * Returns a Result type - check `result.ok` before accessing `result.data`.
 */
export async function executeAuthenticatedGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: GraphQLOptions<Variables>,
): Promise<GraphQLResult<Result>> {
	return executeGraphQL(operation, { ...options, withAuth: true });
}

// ============================================================================
// Raw GraphQL Execution (for API routes without codegen)
// ============================================================================

interface RawGraphQLOptions {
	query: string;
	variables?: Record<string, unknown>;
	headers?: HeadersInit;
}

/**
 * Execute a raw GraphQL mutation without codegen types.
 * Use this for API routes (auth, etc.) that don't use codegen.
 *
 * @example
 * const result = await executeRawGraphQL({
 *   query: `mutation Register($input: AccountRegisterInput!) { ... }`,
 *   variables: { input: { email, password } },
 * });
 *
 * if (!result.ok) {
 *   return NextResponse.json({ error: result.error.message }, { status: 400 });
 * }
 *
 * // Access mutation result
 * const { accountRegister } = result.data;
 * if (accountRegister.errors?.length) {
 *   return validationErrorResponse(accountRegister.errors);
 * }
 */
export async function executeRawGraphQL<T = unknown>(options: RawGraphQLOptions): Promise<GraphQLResult<T>> {
	const url = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (!url) {
		return networkError("Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	}

	const { query, variables, headers } = options;
	const operationName = query.match(/(?:query|mutation)\s+(\w+)/)?.[1] || "RawOperation";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...headers },
			body: JSON.stringify({ query, variables }),
		});

		if (!response.ok) {
			const body = await response.text().catch(() => "");
			return httpError(response.status, `HTTP ${response.status}: ${response.statusText}\n${body}`);
		}

		const body = (await response.json()) as GraphQLResponse<T>;

		if ("errors" in body) {
			return graphqlError(body.errors.map((e) => e.message));
		}

		return success(body.data);
	} catch (error) {
		return networkError(`${operationName}: Failed to execute`, error);
	}
}

/**
 * Helper to create a validation error result from Saleor mutation errors.
 * Use after checking the mutation response for domain errors.
 *
 * @example
 * const { accountRegister } = result.data;
 * if (accountRegister.errors?.length) {
 *   return asValidationError(accountRegister.errors);
 * }
 */
export function asValidationError(
	errors: ReadonlyArray<{ field?: string | null; message: string; code?: string | null }>,
): GraphQLFailure {
	return validationError(errors);
}

// ============================================================================
// Legacy exports (for gradual migration)
// ============================================================================

// Re-export error types for backwards compatibility during migration
export type SaleorErrorType = GraphQLErrorType;

/**
 * @deprecated Use Result pattern instead. This class is kept for gradual migration.
 */
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
		this.isRetryable = options.isRetryable ?? (options.type === "network" || options.type === "http");
		Object.setPrototypeOf(this, new.target.prototype);
	}

	get userMessage(): string {
		return getUserMessage({
			type: this.type,
			message: this.message,
			statusCode: this.statusCode,
			isRetryable: this.isRetryable,
		});
	}
}
