import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql";
import { getServerAuthClient } from "@/app/config";

type GraphQLErrorResponse = {
	errors: readonly {
		message: string;
	}[];
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
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const { variables, headers, cache, revalidate, withAuth = true } = options;

	const input = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache: cache,
		next: { revalidate },
	};

	// Add app token for server components if available and not already provided
	if (typeof window === "undefined" && process.env.SALEOR_APP_TOKEN) {
		const hasAuthHeader =
			headers &&
			Object.entries(headers as Record<string, string>).some(
				([key]) => key.toLowerCase() === "authorization",
			);

		if (!hasAuthHeader) {
			input.headers = {
				...input.headers,
				Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
			};
		}
	}

	if (process.env.NODE_ENV !== "production") {
		const BAR = "*".repeat(70);
		const MAX = Number(process.env.DEBUG_GQL_MAX ?? 200); // bytes
		const chop = (s: string) =>
			s.length > MAX ? `${s.slice(0, MAX)} …[+${s.length - MAX} bytes truncated]` : s;
		const body_as_string = JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		});

		console.debug(`\n${BAR}\n⇢ GraphQL @ ${new Date().toISOString()}\n${BAR}`);
		console.debug("Headers:", input.headers);
		console.debug("Body:", chop(body_as_string));
		console.debug("withAuth:", withAuth);
	}

	const response = withAuth
		? await getServerAuthClient().fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, input)
		: await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	if (process.env.NODE_ENV !== "production") {
		const BAR = "─".repeat(70);
		const MAX = Number(process.env.DEBUG_GQL_MAX ?? 200);
		const chop = (s: string) =>
			s.length > MAX ? `${s.slice(0, MAX)} …[+${s.length - MAX} bytes truncated]` : s;

		const raw = JSON.stringify(await response.clone().json());
		console.debug("⇠ GraphQL raw response");
		console.debug(chop(raw));
		console.debug(`${BAR}\n`);
	}

	if (!response.ok) {
		const body = await (async () => {
			try {
				return await response.text();
			} catch {
				return "";
			}
		})();
		console.error(input.body);
		throw new HTTPError(response, body);
	}

	const body = (await response.json()) as GraphQLRespone<Result>;

	if ("errors" in body) {
		throw new GraphQLError(body);
	}

	return body.data;
}

class GraphQLError extends Error {
	constructor(public errorResponse: GraphQLErrorResponse) {
		const message = errorResponse.errors.map((error) => error.message).join("\n");
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
class HTTPError extends Error {
	constructor(response: Response, body: string) {
		const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
