import { describe, expect, it } from "vitest";
import {
	ACCOUNT_CONFIRM_QUERY_PARAM,
	buildAccountConfirmationRedirectUrl,
	getEmailAndTokenFromSearchParams,
	isAccountConfirmationLink,
} from "./account-confirmation-url";

describe("buildAccountConfirmationRedirectUrl", () => {
	it("points at locale/channel login with confirm flag", () => {
		expect(buildAccountConfirmationRedirectUrl("http://localhost:3000", "en", "default-channel")).toBe(
			"http://localhost:3000/en/default-channel/login?confirm=1",
		);
	});
});

describe("isAccountConfirmationLink", () => {
	it("returns true when confirm=1", () => {
		const params = new URLSearchParams("confirm=1&email=a@b.com&token=abc");
		expect(isAccountConfirmationLink(params)).toBe(true);
	});

	it("returns false for password reset links", () => {
		const params = new URLSearchParams("email=a@b.com&token=abc");
		expect(isAccountConfirmationLink(params)).toBe(false);
	});
});

describe("getEmailAndTokenFromSearchParams", () => {
	it("extracts email and token", () => {
		const params = new URLSearchParams("email=user%40saleor.io&token=secret");
		expect(getEmailAndTokenFromSearchParams(params)).toEqual({
			email: "user@saleor.io",
			token: "secret",
		});
	});

	it("returns null when either param is missing", () => {
		expect(getEmailAndTokenFromSearchParams(new URLSearchParams("email=a@b.com"))).toBeNull();
		expect(getEmailAndTokenFromSearchParams(new URLSearchParams("token=abc"))).toBeNull();
	});
});

describe("ACCOUNT_CONFIRM_QUERY_PARAM", () => {
	it("matches Saleor redirect append key", () => {
		expect(ACCOUNT_CONFIRM_QUERY_PARAM).toBe("confirm");
	});
});
