import "server-only";

import { cache } from "react";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { fetchAuthenticatedUserIfSession } from "./fetch-authenticated-user";

export type HeaderUser = NonNullable<CurrentUserQuery["me"]>;

/** Header user menu — server session only (BFF cookies, no browser Saleor calls). */
export const getHeaderUser = cache(async (): Promise<HeaderUser | null> => {
	const result = await fetchAuthenticatedUserIfSession(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (!result?.ok || !result.data.me) {
		return null;
	}

	return result.data.me;
});
