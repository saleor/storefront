import "server-only";

import { type TypedDocumentString } from "@/gql/graphql";
import { sessionQuery, type GraphQLResult } from "@/lib/saleor";

/** Run a GraphQL operation with the customer session (if any). */
export async function fetchAuthenticatedUserIfSession<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options?: { variables?: Variables },
): Promise<GraphQLResult<Result>> {
	return sessionQuery(operation, options);
}
