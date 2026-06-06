import { describe, expect, it } from "vitest";
import { encodeCookieName } from "./constants";
import { readAuthCookieValue } from "./read-auth-cookie";

describe("readAuthCookieValue", () => {
	const apiUrl = "https://demo.saleor.io/graphql/";
	const accessKey = [apiUrl, "saleor_auth_access_token"].join("+");

	function store(cookies: Array<{ name: string; value: string }>) {
		return {
			get: (name: string) => cookies.find((cookie) => cookie.name === name),
			getAll: () => cookies,
		};
	}

	it("reads the exact encoded cookie name", () => {
		const name = encodeCookieName(accessKey);
		const value = readAuthCookieValue(store([{ name, value: "token-abc" }]), accessKey, apiUrl);
		expect(value).toBe("token-abc");
	});

	it("falls back to scanning cookies for the current API prefix", () => {
		const value = readAuthCookieValue(
			store([{ name: `${encodeCookieName(apiUrl)}saleor_auth_access_token`, value: "token-scan" }]),
			accessKey,
			apiUrl,
		);
		expect(value).toBe("token-scan");
	});

	it("decodes percent-encoded values", () => {
		const name = encodeCookieName(accessKey);
		const encoded = encodeURIComponent("a+b=c");
		const value = readAuthCookieValue(store([{ name, value: encoded }]), accessKey, apiUrl);
		expect(value).toBe("a+b=c");
	});
});
