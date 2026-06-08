import type { GraphQLError, GraphQLResult } from "@/lib/graphql";

export type SessionAuthState<User> =
	| { status: "guest" }
	| { status: "authenticated"; user: User }
	| { status: "unavailable" };

type ClassifiedFetch<User> = SessionAuthState<User> | { status: "unavailable"; retryable: boolean };

const AUTH_FAILURE_PATTERNS = [
	"signature has expired",
	"expired signature",
	"invalid token",
	"invalid refresh token",
	"not authenticated",
	"permission denied",
] as const;

/** True when Saleor rejected the session — safe to treat as signed out. */
export function isDefinitiveAuthFailure(error: GraphQLError): boolean {
	if (error.type === "http" && (error.statusCode === 401 || error.statusCode === 403)) {
		return true;
	}

	if (error.type === "graphql") {
		const message = error.message.toLowerCase();
		return AUTH_FAILURE_PATTERNS.some((pattern) => message.includes(pattern));
	}

	return false;
}

function classifyUserFetch<User>(result: GraphQLResult<{ me?: User | null }>): ClassifiedFetch<User> {
	if (result.ok) {
		if (result.data.me) {
			return { status: "authenticated", user: result.data.me };
		}

		// Session cookies exist but `me` is empty — token refresh race or stale markers.
		return { status: "unavailable", retryable: true };
	}

	if (isDefinitiveAuthFailure(result.error)) {
		return { status: "guest" };
	}

	return { status: "unavailable", retryable: result.error.isRetryable };
}

/**
 * Resolve authenticated user fetch into guest / authenticated / unavailable.
 * When session cookies are present and the first attempt is retryable, retries once on the server.
 */
export async function resolveSessionUserFetch<User>({
	hasSession,
	fetch,
}: {
	hasSession: boolean;
	fetch: () => Promise<GraphQLResult<{ me?: User | null }>>;
}): Promise<SessionAuthState<User>> {
	if (!hasSession) {
		return { status: "guest" };
	}

	const run = async () => classifyUserFetch(await fetch());

	const first = await run();
	if (first.status === "authenticated" || first.status === "guest") {
		return first;
	}

	if (!first.retryable) {
		return { status: "unavailable" };
	}

	const second = await run();
	if (second.status === "authenticated" || second.status === "guest") {
		return second;
	}

	return { status: "unavailable" };
}
