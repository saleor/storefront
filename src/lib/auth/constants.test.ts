import { describe, expect, it } from "vitest";
import { AUTH_COOKIE_MARKERS, decodeCookieValue, encodeCookieName } from "./constants";

describe("auth cookie helpers", () => {
	const apiUrl = "https://demo.saleor.io/graphql/";

	it("maps SDK storage keys to cookie names that match session markers", () => {
		const accessKey = [apiUrl, "saleor_auth_access_token"].join("+");
		const refreshKey = [apiUrl, "saleor_auth_module_refresh_token"].join("+");

		const accessCookie = encodeCookieName(accessKey);
		const refreshCookie = encodeCookieName(refreshKey);

		expect(AUTH_COOKIE_MARKERS.some((marker) => accessCookie.includes(marker))).toBe(true);
		expect(AUTH_COOKIE_MARKERS.some((marker) => refreshCookie.includes(marker))).toBe(true);
	});

	it("decodes percent-encoded cookie values from the client storage layer", () => {
		expect(decodeCookieValue("plain.jwt.token")).toBe("plain.jwt.token");
		expect(decodeCookieValue(encodeURIComponent("a+b=c"))).toBe("a+b=c");
	});
});
