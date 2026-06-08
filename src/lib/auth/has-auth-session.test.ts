import { describe, expect, it, vi } from "vitest";

import { encodeCookieName } from "./constants";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("ts-invariant", () => ({
	invariant: (condition: unknown, message: string) => {
		if (!condition) {
			throw new Error(message);
		}
	},
}));

import { cookies } from "next/headers";
import { getAuthTokenPresence, hasAuthSession } from "./has-auth-session";

const apiUrl = "https://demo.saleor.io/graphql/";
const accessKey = [apiUrl, "saleor_auth_access_token"].join("+");

function mockCookies(cookieList: Array<{ name: string; value: string }>) {
	vi.mocked(cookies).mockResolvedValue({
		get: (name: string) => cookieList.find((cookie) => cookie.name === name),
		getAll: () => cookieList,
	} as Awaited<ReturnType<typeof cookies>>);
	process.env.NEXT_PUBLIC_SALEOR_API_URL = apiUrl;
}

describe("hasAuthSession", () => {
	it("detects access token via encoded SDK cookie name", async () => {
		mockCookies([{ name: encodeCookieName(accessKey), value: "token-abc" }]);
		await expect(hasAuthSession()).resolves.toBe(true);
	});

	it("detects access token via API-prefix fallback", async () => {
		mockCookies([{ name: `${encodeCookieName(apiUrl)}saleor_auth_access_token`, value: "token-scan" }]);
		await expect(getAuthTokenPresence()).resolves.toEqual({
			hasAccess: true,
			hasRefresh: false,
		});
	});

	it("returns false when no auth cookies", async () => {
		mockCookies([{ name: "checkoutId-default-channel", value: "abc" }]);
		await expect(hasAuthSession()).resolves.toBe(false);
	});
});
