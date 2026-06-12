import { describe, expect, it } from "vitest";
import { AccountErrorCode } from "@/gql/graphql";
import { httpStatusForAuthErrors, isInvalidCredentialsError, mapSaleorAuthErrors } from "./auth-api-utils";

describe("isInvalidCredentialsError", () => {
	it("matches Saleor credential error codes", () => {
		expect(isInvalidCredentialsError(AccountErrorCode.InvalidCredentials)).toBe(true);
		expect(isInvalidCredentialsError(AccountErrorCode.InvalidPassword)).toBe(true);
		expect(isInvalidCredentialsError(AccountErrorCode.Inactive)).toBe(false);
	});
});

describe("httpStatusForAuthErrors", () => {
	it("returns 401 for invalid credentials", () => {
		expect(
			httpStatusForAuthErrors([{ message: "Bad login", code: AccountErrorCode.InvalidCredentials }]),
		).toBe(401);
	});

	it("returns 403 for inactive accounts", () => {
		expect(httpStatusForAuthErrors([{ message: "Inactive", code: AccountErrorCode.Inactive }])).toBe(403);
	});

	it("returns 429 for rate limit codes", () => {
		expect(httpStatusForAuthErrors([{ message: "Slow down", code: "RATE_LIMITED" }])).toBe(429);
	});

	it("returns 400 for other validation errors", () => {
		expect(httpStatusForAuthErrors([{ message: "Required", code: AccountErrorCode.Required }])).toBe(400);
	});
});

describe("mapSaleorAuthErrors", () => {
	it("maps Saleor errors with fallback message", () => {
		expect(
			mapSaleorAuthErrors([{ message: null, code: AccountErrorCode.InvalidCredentials }], "Sign in failed"),
		).toEqual([{ message: "Sign in failed", code: AccountErrorCode.InvalidCredentials }]);
	});

	it("returns fallback when errors are empty", () => {
		expect(mapSaleorAuthErrors([], "Sign in failed")).toEqual([{ message: "Sign in failed" }]);
	});
});
