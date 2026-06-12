import "server-only";

import { type TypedDocumentString } from "@/gql/graphql";
import { executeAuthenticatedGraphQL, type GraphQLResult } from "@/lib/graphql";

type AuthQueryOptions<Variables> = {
	cache: RequestCache;
} & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables });

/** Run a GraphQL operation with the customer session (if any). */
export async function fetchAuthenticatedUserIfSession<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: AuthQueryOptions<Variables>,
): Promise<GraphQLResult<Result>> {
	return executeAuthenticatedGraphQL(operation, options);
}
