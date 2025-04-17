import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql";
import { getServerAuthClient } from "@/app/config";

type GraphQLErrorResponse = {
	errors: readonly { message: string }[];
};

type GraphQLRespone<T> = { data: T } | GraphQLErrorResponse;

export async function executeGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: {
		headers?: HeadersInit;
		cache?: RequestCache;
		revalidate?: number;
		withAuth?: boolean;
	} & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables }),
): Promise<Result> {
	// 1) ensure API URL
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const { variables, headers: incomingHeaders, cache, revalidate, withAuth = true } = options;

	// 2) build a real Headers object
	const headers = new Headers(incomingHeaders);
	headers.set("Content-Type", "application/json");

	// 3) on the server, inject the app token if not already present
	if (typeof window === "undefined" && process.env.SALEOR_APP_TOKEN) {
		if (!headers.has("authorization")) {
			headers.set("Authorization", `Bearer ${process.env.SALEOR_APP_TOKEN}`);
		}
	}

	// 4) prepare the fetch input
	const input: RequestInit = {
		method: "POST",
		headers,
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache,
		next: { revalidate },
	};

	// 5) debug constants (non‐prod)
	const MAX = Number(process.env.DEBUG_GQL_MAX ?? 200);
	const STAR_BAR = "*".repeat(70);
	const DASH_BAR = "─".repeat(70);
	const chop = (s: string) =>
		s.length > MAX ? `${s.slice(0, MAX)} …[+${s.length - MAX} bytes truncated]` : s;

	if (process.env.NODE_ENV !== "production") {
		console.debug(`\n${STAR_BAR}\n⇢ GraphQL @ ${new Date().toISOString()}\n${STAR_BAR}`);
		console.debug("Headers:", Object.fromEntries(headers.entries()));
		console.debug("Body:", chop(input.body as string));
		console.debug("withAuth:", withAuth);
	}

	// 6) do the request
	const response = withAuth
		? await getServerAuthClient().fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, input)
		: await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	// 7) debug raw response (non‐prod)
	if (process.env.NODE_ENV !== "production") {
		const raw = JSON.stringify(await response.clone().json());
		console.debug("⇠ GraphQL raw response");
		console.debug(raw.length > MAX ? `${raw.slice(0, MAX)} …` : raw);
		console.debug(`${DASH_BAR}\n`);
	}

	// 8) handle HTTP errors
	if (!response.ok) {
		let bodyText = "";
		try {
			bodyText = await response.text();
		} catch {}
		console.error(input.body);
		throw new HTTPError(response, bodyText);
	}

	// 9) parse and handle GraphQL errors
	const body = (await response.json()) as GraphQLRespone<Result>;
	if ("errors" in body) {
		throw new GraphQLError(body);
	}
	return body.data;
}

class GraphQLError extends Error {
	constructor(public errorResponse: GraphQLErrorResponse) {
		super(errorResponse.errors.map((e) => e.message).join("\n"));
		this.name = "GraphQLError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

class HTTPError extends Error {
	constructor(response: Response, body: string) {
		super(`HTTP error ${response.status}: ${response.statusText}\n${body}`);
		this.name = "HTTPError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
