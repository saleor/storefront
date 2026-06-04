import type { FetchWithAdditionalParams } from "@saleor/auth-sdk";

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Bridge standard fetch to @saleor/auth-sdk fetchWithAuth (FetchWithAdditionalParams).
 * Keeps the optional third SDK argument internal; urql only passes input + init.
 */
export function wrapFetchWithAuth(fetchWithAuth: FetchWithAdditionalParams): FetchFn {
	return (input, init) => fetchWithAuth(input, init);
}
