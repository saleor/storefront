import { cache } from "react";
import { CurrentUserProfileDocument, type CurrentUserProfileQuery } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";

export type AccountUser = NonNullable<CurrentUserProfileQuery["me"]>;

/**
 * Fetch the current user profile, memoized per request via React cache().
 * The layout calls this for auth gating; child pages call it too at zero
 * extra cost -- React deduplicates within the same server render.
 */
export const getCurrentUser = cache(async (): Promise<AccountUser | null> => {
	const result = await executeAuthenticatedGraphQL(CurrentUserProfileDocument, {
		cache: "no-cache",
	});
	if (!result.ok || !result.data.me) return null;
	return result.data.me;
});
