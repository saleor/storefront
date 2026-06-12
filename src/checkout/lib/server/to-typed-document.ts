import "server-only";

import { print, type DocumentNode } from "graphql";

import { TypedDocumentString } from "@/gql/graphql";

/** Bridge checkout codegen gql documents to storefront GraphQL helpers. */
export function toTypedDocument<TResult, TVariables>(document: DocumentNode) {
	return new TypedDocumentString<TResult, TVariables>(print(document));
}
