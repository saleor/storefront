import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { type TypedDocumentString } from "../gql/graphql";

type GraphQLError = {
	message: string;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type GraphQLRespone<T> = { data: T } | { errors: readonly GraphQLError[] };

export const ProductsPerPage = 4;

export async function execute<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options?: {
		variables?: Variables;
		headers?: HeadersInit;
		cache?: RequestCache;
		revalidate?: number;
	},
): Promise<Result> {
	const { variables, headers, cache, revalidate } = options || {};

	const result = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL!, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.HYGRAPH_QUERY_TOKEN}`,
			...headers,
		},
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache: cache,
		next: { revalidate },
	});

	const body = (await result.json()) as GraphQLRespone<Result>;

	if ("errors" in body) {
		throw body.errors[0];
	}

	return body.data;
}

export const USDollarFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

// Saleor Client
export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
});

// Apollo Client
const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_SALEOR_API_URL,
	fetch: saleorAuthClient.fetchWithAuth,
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});
