import { describe, expect, it } from "vitest";

import type { GraphQLError } from "@/lib/graphql";

import { isDefinitiveAuthFailure, resolveSessionUserFetch } from "./session-auth-state";

function graphqlFailure(message: string): GraphQLError {
	return { type: "graphql", message, isRetryable: false };
}

describe("isDefinitiveAuthFailure", () => {
	it("matches expired JWT messages", () => {
		expect(isDefinitiveAuthFailure(graphqlFailure("Signature has expired"))).toBe(true);
	});

	it("matches HTTP 401", () => {
		expect(
			isDefinitiveAuthFailure({
				type: "http",
				message: "Unauthorized",
				statusCode: 401,
				isRetryable: false,
			}),
		).toBe(true);
	});

	it("does not treat network errors as auth failure", () => {
		expect(
			isDefinitiveAuthFailure({
				type: "network",
				message: "fetch failed",
				isRetryable: true,
			}),
		).toBe(false);
	});

	it("does not treat generic GraphQL errors as auth failure", () => {
		expect(isDefinitiveAuthFailure(graphqlFailure("Internal server error"))).toBe(false);
	});
});

describe("resolveSessionUserFetch", () => {
	it("returns guest when no session cookies", async () => {
		const result = await resolveSessionUserFetch({
			hasSession: false,
			fetch: async () => ({ ok: true, data: { me: { id: "1" } } }),
		});

		expect(result).toEqual({ status: "guest" });
	});

	it("returns authenticated when me is present", async () => {
		const user = { id: "1", email: "a@b.com" };
		const result = await resolveSessionUserFetch({
			hasSession: true,
			fetch: async () => ({ ok: true, data: { me: user } }),
		});

		expect(result).toEqual({ status: "authenticated", user });
	});

	it("returns guest on definitive auth failure", async () => {
		const result = await resolveSessionUserFetch({
			hasSession: true,
			fetch: async () => ({
				ok: false,
				error: { type: "http", message: "Unauthorized", statusCode: 401, isRetryable: false },
			}),
		});

		expect(result).toEqual({ status: "guest" });
	});

	it("returns unavailable on retryable network error without showing guest", async () => {
		let calls = 0;
		const result = await resolveSessionUserFetch({
			hasSession: true,
			fetch: async () => {
				calls += 1;
				return {
					ok: false,
					error: { type: "network", message: "timeout", isRetryable: true },
				};
			},
		});

		expect(result).toEqual({ status: "unavailable" });
		expect(calls).toBe(2);
	});

	it("returns authenticated when retry succeeds", async () => {
		const user = { id: "1" };
		let calls = 0;

		const result = await resolveSessionUserFetch({
			hasSession: true,
			fetch: async () => {
				calls += 1;
				if (calls === 1) {
					return {
						ok: false,
						error: { type: "network", message: "timeout", isRetryable: true },
					};
				}
				return { ok: true, data: { me: user } };
			},
		});

		expect(result).toEqual({ status: "authenticated", user });
		expect(calls).toBe(2);
	});

	it("returns unavailable when cookies exist but me is null", async () => {
		let calls = 0;
		const result = await resolveSessionUserFetch({
			hasSession: true,
			fetch: async () => {
				calls += 1;
				return { ok: true, data: { me: null } };
			},
		});

		expect(result).toEqual({ status: "unavailable" });
		expect(calls).toBe(2);
	});
});
