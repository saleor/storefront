import "server-only";

import type { GraphQLResult } from "@/lib/graphql";
import { hasAuthSession } from "./has-auth-session";
import { resolveSessionUserFetch, type SessionAuthState } from "./session-auth-state";

export type { SessionAuthState } from "./session-auth-state";
export { isDefinitiveAuthFailure, resolveSessionUserFetch } from "./session-auth-state";

/** Convenience wrapper — checks cookies then resolves `me`. */
export async function resolveSessionUser<User>(
	fetch: () => Promise<GraphQLResult<{ me?: User | null }>>,
): Promise<SessionAuthState<User>> {
	const hasSession = await hasAuthSession();
	return resolveSessionUserFetch({ hasSession, fetch });
}
