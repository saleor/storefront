type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type AuthFetchWithAuth = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * Bridge standard fetch (RequestInfo | URL) to @saleor/auth-sdk fetchWithAuth.
 * The SDK types input as RequestInfo only; urql and fetch callers pass URL too.
 */
export function wrapFetchWithAuth(fetchWithAuth: AuthFetchWithAuth): FetchFn {
	return (input, init) => fetchWithAuth(input as RequestInfo, init);
}
