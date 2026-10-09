import "server-only";

import { cache } from "react";
import type { TypedDocumentString } from "../../gql/graphql";
import {
	executeGraphQL,
	getUserMessage,
	type GraphQLAuth,
	type GraphQLError,
	type GraphQLOptions,
	type GraphQLResult,
} from "./client";
import { applyCacheProfile, type CacheProfile, type CacheTagParams } from "./cache/manifest";
import { operationNameFromDocument, resolveOperationCall } from "./operations";

type CallExtras = {
	maxRetries?: number;
	timeoutMs?: number;
	headers?: HeadersInit;
};

export class SaleorDataError extends Error {
	readonly isRetryable: boolean;
	readonly type: GraphQLError["type"];
	readonly userMessage: string;

	constructor(readonly graphqlError: GraphQLError) {
		super(graphqlError.message);
		this.name = "SaleorDataError";
		this.isRetryable = graphqlError.isRetryable;
		this.type = graphqlError.type;
		this.userMessage = getUserMessage(graphqlError);
	}
}

/**
 * Cached catalog read. Call only from inside `"use cache"`.
 * Applies the manifest profile (so a call outside `"use cache"` throws) and
 * throws on transport or GraphQL failure so Next does not cache the outage.
 * A missing entity is `null` on the payload, not an error.
 */
export async function cachedQuery<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: {
		profile: CacheProfile;
		tag?: string | CacheTagParams;
		variables?: Variables;
	} & CallExtras,
): Promise<Result> {
	const spec = resolveOperationCall(operationNameFromDocument(operation), "cached");
	applyCacheProfile(options.profile, options.tag);

	const result = await executeGraphQL(operation, {
		variables: options.variables as Variables,
		headers: options.headers,
		maxRetries: options.maxRetries,
		timeoutMs: options.timeoutMs,
		auth: spec.auth,
		ledgerMode: "cached",
	} as unknown as GraphQLOptions<Variables> & { auth: GraphQLAuth });

	if (!result.ok) {
		throw new SaleorDataError(result.error);
	}
	return result.data;
}

const memoizedRead = cache(
	async (
		query: string,
		variablesJson: string,
		auth: GraphQLAuth,
		mode: string,
		maxRetries: number | null,
		timeoutMs: number | null,
	): Promise<GraphQLResult<unknown>> => {
		const operation = { toString: () => query } as TypedDocumentString<unknown, Record<string, unknown>>;
		return executeGraphQL(operation, {
			// Omit variables entirely when the caller passed none. `{}` is still a variables
			// payload and changes the request Saleor sees.
			...(variablesJson === "null"
				? {}
				: { variables: JSON.parse(variablesJson) as Record<string, unknown> }),
			auth,
			cache: "no-cache",
			ledgerMode: mode,
			...(maxRetries !== null ? { maxRetries } : {}),
			...(timeoutMs !== null ? { timeoutMs } : {}),
		} as unknown as GraphQLOptions<Record<string, unknown>> & { auth: GraphQLAuth });
	},
);

async function uncachedRead<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	via: "live" | "session",
	options: CallExtras & { variables?: Variables },
): Promise<GraphQLResult<Result>> {
	const spec = resolveOperationCall(operationNameFromDocument(operation), via);
	if (via === "live" && spec.auth === "session") {
		throw new Error(
			`[saleor] "${operationNameFromDocument(operation)}" needs the customer session. Use sessionQuery().`,
		);
	}

	const result = await memoizedRead(
		operation.toString(),
		JSON.stringify(options.variables ?? null),
		spec.auth,
		via,
		options.maxRetries ?? null,
		options.timeoutMs ?? null,
	);
	return result as GraphQLResult<Result>;
}

/** Public, uncached read. Also the escape hatch for a cached operation's long tail (filters, search). */
export async function liveQuery<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options?: CallExtras & { variables?: Variables },
): Promise<GraphQLResult<Result>> {
	return uncachedRead(operation, "live", options ?? {});
}

/** Per-user read. Request-memoized. Never cached in the shared cache. */
export async function sessionQuery<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options?: CallExtras & { variables?: Variables },
): Promise<GraphQLResult<Result>> {
	return uncachedRead(operation, "session", options ?? {});
}

/** Mutation. Server actions only. Always `no-cache`. */
export async function mutate<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options?: CallExtras & { variables?: Variables },
): Promise<GraphQLResult<Result>> {
	const spec = resolveOperationCall(operationNameFromDocument(operation), "mutate");
	const resolved = options ?? {};
	return executeGraphQL(operation, {
		variables: resolved.variables as Variables,
		headers: resolved.headers,
		maxRetries: resolved.maxRetries,
		timeoutMs: resolved.timeoutMs,
		auth: spec.auth,
		cache: "no-cache",
		ledgerMode: "mutate",
	} as unknown as GraphQLOptions<Variables> & { auth: GraphQLAuth });
}
