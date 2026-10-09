import { describe, expect, it } from "vitest";
import { canRecordFixture, fixtureKey } from "./fixtures";

describe("canRecordFixture", () => {
	it("records anonymous queries only", () => {
		const query = JSON.stringify({ query: "query ProductDetails { product { id } }" });
		expect(canRecordFixture("none", query)).toBe(true);
		expect(fixtureKey("ProductDetails", query)).toMatch(/^ProductDetails\.[0-9a-f]{16}\.json$/);
		expect(canRecordFixture("session", query)).toBe(false);
		expect(canRecordFixture("app", query)).toBe(false);
	});

	it("refuses mutations so passwords and tokens are not written to disk", () => {
		const mutation = JSON.stringify({
			query:
				"mutation AccountRegister($input: AccountRegisterInput!) { accountRegister(input: $input) { user { id } } }",
			variables: { input: { email: "a@b.c", password: "secret" } },
		});
		expect(canRecordFixture("none", mutation)).toBe(false);
		expect(fixtureKey("AccountRegister", mutation)).toBeNull();
	});

	it("does not build a fixture name from a password change", () => {
		const body = JSON.stringify({
			query:
				"mutation PasswordChange($oldPassword: String!, $newPassword: String!) { passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) { errors { message } } }",
			variables: { oldPassword: "current-secret", newPassword: "next-secret" },
		});
		expect(fixtureKey("PasswordChange", body)).toBeNull();
	});
});
