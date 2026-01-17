import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql";
import { getServerAuthClient } from "@/app/config.server";

type GraphQLErrorResponse = {
	errors: readonly {
		message: string;
	}[];
};

type GraphQLRespone<T> = { data: T } | GraphQLErrorResponse;

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

	let response: Response;
	try {
		if (withAuth) {
			try {
				response = await (
					await getServerAuthClient()
				).fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);
			} catch (authError) {
				// During static generation, cookies() throws - fall back to unauthenticated fetch
				// Next.js throws errors with digest 'DYNAMIC_SERVER_USAGE' when dynamic APIs are used during static generation
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
	} catch (error) {
		// Network errors (DNS failure, connection refused, timeout, etc.)
		throw new SaleorError("Failed to connect to Saleor API", {
			type: "network",
			isRetryable: true,
			cause: error,
		});
	}

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
