import "server-only";

import { executeRawGraphQL, type GraphQLResult } from "./client";
import { recordSaleorCall } from "./ledger";

type RawOptions = {
	query: string;
	variables?: Record<string, unknown>;
	headers?: HeadersInit;
};

/**
 * Untyped mutation for the auth BFF routes that predate codegen documents.
 * Prefer `mutate()` with a `.graphql` document everywhere else.
 */
export async function rawMutation<T = unknown>(options: RawOptions): Promise<GraphQLResult<T>> {
	const started = Date.now();
	const name = options.query.match(/(?:query|mutation)\s+(\w+)/)?.[1] || "RawOperation";
	const result = await executeRawGraphQL<T>(options);
	recordSaleorCall({
		op: name,
		mode: "raw",
		auth: "none",
		ok: result.ok,
		ms: Date.now() - started,
	});
	return result;
}
