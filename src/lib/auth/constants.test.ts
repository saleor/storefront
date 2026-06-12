import { describe, expect, it } from "vitest";
import { decodeCookieValue, encodeCookieName } from "./constants";

describe("auth cookie helpers", () => {
	const apiUrl = "https://demo.saleor.io/graphql/";

	it("encodes SDK storage keys into valid cookie names", () => {
		const accessKey = [apiUrl, "saleor_auth_access_token"].join("+");
		const accessCookie = encodeCookieName(accessKey);

		// Cookie names must not contain ':' '/' or '+' from the raw SDK key.
		expect(accessCookie).not.toMatch(/[:/+]/);
		expect(accessCookie).toContain("saleor_auth_access_token");
	});

	it("decodes percent-encoded cookie values from the client storage layer", () => {
		expect(decodeCookieValue("plain.jwt.token")).toBe("plain.jwt.token");
		expect(decodeCookieValue(encodeURIComponent("a+b=c"))).toBe("a+b=c");
	});
});
