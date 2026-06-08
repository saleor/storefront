import { cache } from "react";
import { CurrentUserProfileDocument, type CurrentUserProfileQuery } from "@/gql/graphql";
import { fetchAuthenticatedUserIfSession } from "@/lib/auth/fetch-authenticated-user";
import { resolveSessionUser, type SessionAuthState } from "@/lib/auth/resolve-session-user";

export type AccountUser = NonNullable<CurrentUserProfileQuery["me"]>;
export type AccountAuthState = SessionAuthState<AccountUser>;

/**
 * Fetch the current user profile, memoized per request via React cache().
 * Returns guest / authenticated / unavailable — never conflates transient errors with signed out.
 */
export const getAccountAuthState = cache(async (): Promise<AccountAuthState> => {
	return resolveSessionUser(() =>
		fetchAuthenticatedUserIfSession(CurrentUserProfileDocument, {
			cache: "no-cache",
		}),
	);
});
