import "server-only";

import { CurrentUserOrdersPaginatedDocument, OrderByNumberDocument } from "@/gql/graphql";
import { sessionQuery } from "@/lib/saleor";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

/** Live, per-request customer orders. Never shared-cached. */
export function getCurrentUserOrders(localeSlug: string, first: number, after?: string | null) {
	return sessionQuery(CurrentUserOrdersPaginatedDocument, {
		variables: {
			first,
			after: after || null,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});
}

/** Live order list used to resolve one order number for the signed-in customer. */
export function getOrdersForNumberLookup(localeSlug: string, first = 100) {
	return sessionQuery(OrderByNumberDocument, {
		variables: {
			first,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});
}
